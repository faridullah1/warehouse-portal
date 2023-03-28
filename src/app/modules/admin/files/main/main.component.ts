import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'app/api.service';
import { FilePicture, GenericApiResponse, WarehouseFile } from 'app/models';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FileListComponent implements OnInit {
	@ViewChild('createStartDate') createStartDate: ElementRef<MatInput>;
	@ViewChild('createEndDate') createEndDate: ElementRef<MatInput>;

	files: WarehouseFile[] = [];
	filters: FormGroup;
	viewType: 'list' | 'grid' = 'grid';
	loadingFiles = false;

    constructor(private apiService: ApiService,
				private toaster: ToastrService,
				private confirmationService: FuseConfirmationService,
				private fileSaverService: FileSaverService)
	{
		this.filters = new FormGroup({
			reference: new FormControl(''),
			isDamaged: new FormControl(false),
			range: new FormGroup({
				start: new FormControl<Date | null>(null),
				end: new FormControl<Date | null>(null),
			})
		});
	}

    ngOnInit(): void {
		this.getAllFiles();
    }

	getAllFiles(): void {
		this.loadingFiles = true;
		const slug = this.getSlug();

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => {
				this.loadingFiles = false;
				this.files = resp.data.files.map((file) => {
					file.pictures = file.file_images.map(img => img.url);
					file.maxImagesToShow = 8;
					return file;
				});
			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loadingFiles = false;
			}
		});
	}

	onDownloadFile(file: WarehouseFile): void {
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
	getFileName = (path: string) => path.substring(path.lastIndexOf('/') +1);
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	getFileType = (path: string) => path.substring(path.lastIndexOf('/') +1).split('.')[1].toLowerCase();

	getFileReportSummary(doc: jsPDF, file: WarehouseFile): void {
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

	addFilePicsToPDF(doc: jsPDF, file: WarehouseFile): void {
		file.file_images.forEach((image: FilePicture, index: number) => {
			if (index === 0) {
				doc.addImage(image.url, this.getFileType(image.url), 40, 60, 120, 120);

				// Sub Heading
				doc.setFontSize(14);
				doc.text('Uploaded At: ', 40, 190);

				// Text
				doc.setFontSize(10);
				doc.text(moment(image.createdAt).format('D/MM/YYYY hh:mm'), 75, 190);
			}
			else {
				doc.addPage();
				doc.addImage(file.pictures[index], this.getFileType(image.url), 40, 60, 120, 120);

				// Sub Heading
				doc.setFontSize(14);
				doc.text('Uploaded At: ', 40, 190);

				// Text
				doc.setFontSize(10);
				doc.text(moment(image.createdAt).format('D/MM/YYYY hh:mm'), 75, 190);
			}
		});
	}

	onGeneratePDFReport(file: WarehouseFile): void {
		// Create a new document
		const doc = new jsPDF();

		// Summary of file report
		this.getFileReportSummary(doc, file);
		// Add images to pdf
		this.addFilePicsToPDF(doc, file);

		doc.save('file.pdf');
	}

	onAddPicture(file: WarehouseFile): void { }

	onDeleteFile(file: WarehouseFile): void {
		const dialog = this.confirmationService.open({
			title: 'Delete File',
			message: `Are you sure, you want to delete "${file.reference}"`
		});

		dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
			if (action === 'confirmed') {
				this.apiService.delete(`files/${file.fileId}`).subscribe({
					next: (resp: GenericApiResponse) => {
						const id = this.files.indexOf(file);
						this.files.splice(id, 1);
					},
					error: (error: any) => {
						this.toaster.error(error);
						this.loadingFiles = false;
					}
				});
			}
		});
	}

	onReset(): void {
		this.createStartDate.nativeElement.value = '';
		this.createEndDate.nativeElement.value = '';

		this.filters.reset();
		this.getAllFiles();
	}

	onDateChange(event: MatDatepickerInputEvent<any>, controlName: string): void {
		const control = this.filters.get('range')['controls'][controlName];
		const endOfDay = moment(event.value.valueOf()).endOf('day');
		const startOfDay = moment(event.value.valueOf()).startOf('day');

		if (controlName === 'start') {
			control.setValue(startOfDay);
		}
		else
		{
			control.setValue(endOfDay);
		}

		this.filters.markAsDirty();
	}

	onViewChange(view: 'list' | 'grid'): void {
		this.viewType = view;
	}

	private getSlug(): string {
		const filters = this.filters.value;

		let slug = 'files';

		let counter = 0;
		let operator = '';

		for (const key of Object.keys(filters))
		{
			if (key === 'range') {
				const { start, end } = filters[key];

				if (start && end) {
					counter++;
					operator = counter > 1 ? '&' : '?';
					slug += `${operator}createdAt[gt]=${start}&createdAt[lt]=${end}`;
				}

				continue;
			}

			if (filters[key]) {
				counter++;
				operator = counter > 1 ? '&' : '?';
				slug += `${operator}${key}=${filters[key]}`;
			}
		}

		return slug;
	}
}
