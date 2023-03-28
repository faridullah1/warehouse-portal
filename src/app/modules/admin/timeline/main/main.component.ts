import { Component, OnInit } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FilePicture, GenericApiResponse, WarehouseFile } from 'app/models';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../api.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class TimelineComponent implements OnInit {
	filePictures: FilePicture[] = [];
	viewType: 'list' | 'grid' = 'grid';
	loadingImages = false;

    constructor(private apiService: ApiService,
				private confirmationService: FuseConfirmationService,
				private toaster: ToastrService)
	{ }

    ngOnInit(): void {
		this.getAllFileImages();
    }

	getAllFileImages(): void {
		this.loadingImages = true;

		this.apiService.get('fileImages').subscribe({
			next: (resp: GenericApiResponse) => {
				this.filePictures = resp.data.pictures;
				this.loadingImages = false;
			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loadingImages = false;
			}
		});
	}

	onViewChange(view: 'list' | 'grid'): void {
		this.viewType = view;
	}

	onDeleteFileImage(pic: FilePicture): void {
		const dialog = this.confirmationService.open({
			title: 'Delete picture',
			message: 'Are you sure, you want to delete picture'
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
}
