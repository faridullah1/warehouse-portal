import { ApiService } from 'app/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FilePicture, GenericApiResponse, WarehouseFile } from 'app/models';
import { ImageViewerComponent } from 'app/shared/image-viewer/image-viewer.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';


@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {
	file: WarehouseFile;
	imagesDeleted = false;

	fromTimelineView = false;
	dialogTitle: string;

    constructor(private dialogRef: MatDialogRef<FileDetailComponent>,
				private dialog: MatDialog,
				private apiService: ApiService,
				private toaster: ToastrService,
				private translocoService: TranslocoService,
				private confirmationService: FuseConfirmationService)
	{ }

    ngOnInit(): void {
		this.translocoService.selectTranslate('File_Detail').pipe(take(1)).subscribe((translation: string) => {
			this.dialogTitle = translation;
		});

		if (this.fromTimelineView) {
			this.getFile();
		}
    }

	getFile(): void {
		this.apiService.get(`files/${this.file.fileId}`).subscribe({
			next: (resp: GenericApiResponse) => this.file = resp.data.file,
			error: (error: any) => this.toaster.error(error)
		});
	}

	onDialogClose(): void {
		this.dialogRef.close(this.imagesDeleted);
	}

	onViewImage(pic: FilePicture): void {
		const dialog = this.dialog.open(ImageViewerComponent, {
			width: '80vw',
			maxWidth: '80vw',
			height: '80vh',
			maxHeight: '80vh',
			panelClass: 'image-viewer-dlg'
		});

		dialog.componentInstance.imageSrc = pic.url;
	}

	onDeleteImage(pic: FilePicture): void {
		const dialog = this.confirmationService.open({
			title: 'Delete picture',
			message: 'Are you sure, you want to delete picture?'
		});

		dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
			if (action === 'confirmed') {
				this.apiService.delete(`fileImages/${pic.fileImageId}`).subscribe({
					next: () => {
						const id = this.file.file_images.indexOf(pic);
						this.file.file_images.splice(id, 1);
						this.imagesDeleted = true;
					},
					error: (error: any) => this.toaster.error(error)
				});
			}
		});
	}
}
