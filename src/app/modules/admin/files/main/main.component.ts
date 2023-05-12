import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'app/api.service';
import { FilePicture, GenericApiResponse, KolliAppFile } from 'app/models';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FileDetailComponent } from './../file-detail/file-detail.component';
import { take } from 'rxjs';
import { UploadPicturesToExistingFileComponent } from '../upload-new-pictures/upload-pictures.component';
import { TranslocoService } from '@ngneat/transloco';
import { UpdateFileComponent } from './../update-file/update-file.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FileListComponent implements OnInit {
	@ViewChild('scrollElem') scrollElem: ElementRef<HTMLElement>;

	files: KolliAppFile[] = [];
	viewType: 'list' | 'grid' = 'grid';
	loadingPage = false;
	disableLoadMoreBtn = false;
	filters: any = {};

	page = 1;
	limit = 10;
	total = 0;

    constructor(private apiService: ApiService,
				private toaster: ToastrService,
				private confirmationService: FuseConfirmationService,
				private matDialog: MatDialog,
				private fileSaverService: FileSaverService,
				private translocoService: TranslocoService)
	{ }

    ngOnInit(): void {
		this.getAllFiles();
    }

	getAllFiles(loadMore = false): void {
		// Either load complete page or disableLoadMoreBtn and add files to the existing array;
		if (loadMore) {
			this.disableLoadMoreBtn = true;
		}
		else {
			this.loadingPage = true;
		}

		const slug = this.getSlug();

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => {
				this.loadingPage = false;
				this.disableLoadMoreBtn = false;

				const newData = resp.data.files.rows.map((file) => {
					file.pictures = file.file_images.map(img => img.url);
					file.maxImagesToShow = 8;
					return file;
				});
				this.total = resp.data.files.count;

				if (loadMore) {
					this.files = [...this.files, ...newData];

					setTimeout(() => {
						this.scrollElem.nativeElement.scrollIntoView({
							behavior: 'smooth'
						});
					}, 100);
				}
				else {
					this.files = [...newData];
				}

			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loadingPage = false;
				this.disableLoadMoreBtn = false;
			}
		});
	}

	onFilterEvent(ev: any): void {
		switch(ev.type) {
			case 'FilterChange':
				console.log('Filter change =', ev.data);
				this.filters = ev.data;
				this.page = 1;
				this.getAllFiles();
				break;

			case 'LoadFiles':
				this.getAllFiles();
				break;
		}
	}

	onViewFileDetail(file: KolliAppFile): void {
		const dialog = this.matDialog.open(FileDetailComponent, {
			width: '40vw',
			height: '80vh',
			panelClass: 'file-detail-dlg'
		});

		dialog.componentInstance.file = file;

		dialog.afterClosed().subscribe((resp) => {
			if (resp) {
				this.page = 1;
				this.getAllFiles();
			}
		});
	}

	onMenuTrigger(ev: MouseEvent): void {
		ev.stopPropagation();
	}

	onDownloadFile(file: KolliAppFile): void {
		const zip = new JSZip();
		const folder = zip.folder('pictures');

		file.pictures.forEach((url)=> {
			const blobPromise = fetch(url).then((r) => {
				if (r.status === 200) {
					return r.blob();
				}
				return Promise.reject(new Error(r.statusText));
			});

			const name = url.substring(url.lastIndexOf('/'));
			folder?.file(name, blobPromise);
		});

		zip.generateAsync({ type:'blob' }).then((content) => {
			this.fileSaverService.save(content, 'file_pictures.zip');
		});
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	getFileType = (path: string) => path.substring(path.lastIndexOf('/') +1).split('.')[1].toLowerCase();

	getFileReportSummary(doc: jsPDF, file: KolliAppFile): void {
		const mainHeadingX = 20;
		const istRowX = 30;
		const secondRowX = 40;

		// Main heading
		doc.setFontSize(24);
		doc.text('File Summary', 10, mainHeadingX);


		// Sub Heading
		doc.setFontSize(14);
		doc.text('Reference: ', 10, istRowX);
		// Text
		doc.setFontSize(10);
		doc.text(file.reference, 50, istRowX);
		// Sub Heading
		doc.setFontSize(14);
		doc.text('Container number(s): ', 100, istRowX);
		// Text
		doc.setFontSize(10);
		const containerNumber = file.containerNumber || 'NA';
		doc.text(containerNumber, 160, istRowX);


		// Sub Heading
		doc.setFontSize(14);
		doc.text('Damaged goods: ', 10, secondRowX);
		// Text
		doc.setFontSize(10);
		doc.text(file.noOfDamagedGoods.toString(), 50, secondRowX);
		// Sub Heading
		doc.setFontSize(14);
		doc.text('Date created: ', 100, secondRowX);
		// Text
		doc.setFontSize(10);
		doc.text(moment(file.createdAt).format('D/MM/YYYY hh:mm'), 160, secondRowX);


		// Line break for summary section
		doc.line(10, 45, doc.internal.pageSize.width - 10, 45);
	}

	addFilePicsToPDF(doc: jsPDF, file: KolliAppFile): void {
		file.file_images.forEach((image: FilePicture, index: number) =>
		{
			if (index !== 0) {
				doc.addPage();
			}

			doc.addImage(image.url, this.getFileType(image.url), 40, 60, 120, 120);

			// Sub Heading
			doc.setFontSize(14);
			doc.text('Uploaded At: ', 40, 190);

			// Text
			doc.setFontSize(10);
			doc.text(moment(image.createdAt).format('D/MM/YYYY hh:mm'), 75, 190);
		});
	}

	onGeneratePDFReport(file: KolliAppFile): void {
		// Create a new document
		const doc = new jsPDF();

		// Summary of file report
		this.getFileReportSummary(doc, file);
		// Add images to pdf
		this.addFilePicsToPDF(doc, file);

		doc.save('file.pdf');
	}

	onAddPicture(file: KolliAppFile): void {
		const dialog = this.matDialog.open(UploadPicturesToExistingFileComponent, {
			width: '25vw'
		});

		dialog.componentInstance.fileId = file.fileId;

		dialog.afterClosed().subscribe((resp) => {
			if (resp) {
				this.getAllFiles();
			}
		});
	}

	onDeleteFile(file: KolliAppFile): void {
		let title;
		let message;

		this.translocoService.selectTranslate('Delete_File').pipe(take(1)).subscribe((translation) => {
			title = translation;
		});

		this.translocoService.selectTranslate('Delete_Message').pipe(take(1)).subscribe((translation) => {
			message = `${translation} "${file.reference}"?`;
		});

		const dialog = this.confirmationService.open({ title, message });

		dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
			if (action === 'confirmed') {
				this.apiService.delete(`files/${file.fileId}`).subscribe({
					next: () => {
						const id = this.files.indexOf(file);
						this.files.splice(id, 1);
						this.total -= 1;
					},
					error: (error: any) => {
						this.toaster.error(error);
						this.loadingPage = false;
					}
				});
			}
		});
	}

	onViewChange(view: 'list' | 'grid'): void {
		this.viewType = view;
	}

	onLoadMore(): void {
		this.page++;
		this.getAllFiles(true);
	}

	onSeeEntireList(event: MouseEvent, file: KolliAppFile): void {
		event.stopPropagation();
		file.maxImagesToShow = file.pictures.length;
	}

	onUpdateFile(file: KolliAppFile): void {
		const dialog = this.matDialog.open(UpdateFileComponent, {
			width: '25vw'
		});

		dialog.componentInstance.fileId = file.fileId;

		dialog.afterClosed().subscribe((resp) => {
			if (resp) {
				this.getAllFiles();
			}
		});
	}

	getFileImage(picture: string): string {
		const fileExtension = picture?.split('.').pop();

		switch(fileExtension) {
			case 'pdf':
				return '/assets/images/pdf_img.jpg';

			case 'docx':
			case 'doc':
				return '/assets/images/word_img.png';

			case 'xlsx':
				return '/assets/images/excel_img.png';

			default:
				return picture;
		}
	}

	private getSlug(): string {
		let slug = `files?page=${this.page}&limit=${this.limit}`;

		for (const key of Object.keys(this.filters))
		{
			if (key === 'range') {
				const { start, end } = this.filters[key];

				if (start && end) {
					const startOfDay = moment(start.valueOf()).startOf('day');
					const endOfDay = moment(end.valueOf()).endOf('day');

					slug += `&createdAt[gt]=${startOfDay}&createdAt[lt]=${endOfDay}`;
				}

				if (start && end == null) {
					const startOfDay = moment(start.valueOf()).startOf('day');
					const endOfDay = moment(start.valueOf()).endOf('day');

					slug += `&createdAt[gt]=${startOfDay}&createdAt[lt]=${endOfDay}`;
				}

				continue;
			}

			if (this.filters[key]) {
				slug += `&${key}=${this.filters[key]}`;
			}
		}

		return slug;
	}
}
