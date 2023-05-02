import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilePicture, GenericApiResponse, WarehouseFile } from 'app/models';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../api.service';
import { ImageViewerComponent } from './../../../../shared/image-viewer/image-viewer.component';
import { FileDetailComponent } from '../../files/file-detail/file-detail.component';


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

		this.apiService.get(`fileImages?page=${this.page}&limit=${this.limit}`).subscribe({
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

	onViewFile(file: WarehouseFile): void {
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
}
