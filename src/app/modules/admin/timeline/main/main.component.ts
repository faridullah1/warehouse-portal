import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilePicture, GenericApiResponse, KolliAppFile } from 'app/models';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../api.service';
import { ImageViewerComponent } from './../../../../shared/image-viewer/image-viewer.component';
import { FileDetailComponent } from '../../files/file-detail/file-detail.component';
import moment from 'moment';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class TimelineComponent implements OnInit {
	@ViewChild('scrollElem') scrollElem: ElementRef<HTMLElement>;

	filePictures: FilePicture[] = [];
	viewType: 'list' | 'grid' = 'grid';
	loadingPage = false;
	loadMore = false;

	page = 1;
	limit = 20;
	total = 0;
	filters: any = {};

    constructor(private apiService: ApiService,
				private confirmationService: FuseConfirmationService,
				private dialog: MatDialog,
				private toaster: ToastrService)
	{ }

    ngOnInit(): void {
		this.getAllFileImages();
    }

	getAllFileImages(scrollTo = false): void {
		if (scrollTo) {
			this.loadMore = true;
		}
		else {
			this.loadingPage = true;
		}

		this.apiService.get(this.getSlug()).subscribe({
			next: (resp: GenericApiResponse) => {
				const { rows, count } = resp.data.pictures;
				this.total = count;
				this.loadingPage = false;
				this.loadMore = false;

				if (scrollTo) {
					this.filePictures = [...this.filePictures, ...rows];

					setTimeout(() => {
						this.scrollElem.nativeElement.scrollIntoView({
							behavior: 'smooth'
						});
					}, 100);
				}
				else {
					this.filePictures = [...rows];
				}
			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loadingPage = false;
				this.loadMore = false;
			}
		});
	}

	onFilterEvent(ev: any): void {
		switch(ev.type) {
			case 'FilterChange':
				this.filters = ev.data;
				this.page = 1;
				this.getAllFileImages();
				break;

			case 'LoadFiles':
				this.getAllFileImages();
				break;
		}
	}

	onViewChange(view: 'list' | 'grid'): void {
		this.viewType = view;
	}

	onLoadMore(): void {
		this.page++;
		this.getAllFileImages(true);
	}

	onImageViewer(pic: FilePicture): void {
		const dialog = this.dialog.open(ImageViewerComponent, {
			width: '80vw',
			maxWidth: '80vw',
			height: '80vh',
			maxHeight: '80vh',
			panelClass: 'image-viewer-dlg'
		});

		dialog.componentInstance.imageSrc = pic.url;
	}

	onDeleteFileImage(pic: FilePicture): void {
		const dialog = this.confirmationService.open({
			title: 'Delete picture',
			message: 'Are you sure, you want to delete picture?'
		});

		dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
			if (action === 'confirmed') {
				this.apiService.delete(`fileImages/${pic.fileImageId}`).subscribe({
					next: () => {
						const id = this.filePictures.indexOf(pic);
						this.filePictures.splice(id, 1);
					},
					error: (error: any) => this.toaster.error(error)
				});
			}
		});
	}

	onViewFile(event: MouseEvent, file: KolliAppFile): void {
		event.stopPropagation();

		const dialog = this.dialog.open(FileDetailComponent, {
			width: '40vw',
			height: '80vh',
			panelClass: 'file-detail-dlg'
		});

		dialog.componentInstance.file = file;
		dialog.componentInstance.fromTimelineView = true;

		dialog.afterClosed().subscribe((resp) => {
			if (resp) {
				this.getAllFileImages();
			}
		});
	}

	getFileExtension(image: string): string {
		return image?.split('.').pop();
	}

	getFileImageSrc(image: string): string {
		const fileExtension = image?.split('.').pop();

		switch(fileExtension) {
			case 'pdf':
				return '/assets/images/pdf_img.jpg';

			case 'docx':
			case 'doc':
				return '/assets/images/word_img.png';

			case 'xlsx':
				return '/assets/images/excel_img.png';

			default:
				return image;
		}
	}

	private getSlug(): string {
		let slug = `fileImages?page=${this.page}&limit=${this.limit}`;

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
