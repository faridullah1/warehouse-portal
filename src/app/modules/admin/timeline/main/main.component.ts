import { Component, OnInit } from '@angular/core';
import { FilePicture, GenericApiResponse } from 'app/models';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './../../../../api.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class TimelineComponent implements OnInit {
	filePictures: FilePicture[] = [];
	loading = false;

    constructor(private apiService: ApiService, 
				private toaster: ToastrService) 
	{ }

    ngOnInit(): void {
		this.getAllFileImages();
    }

	getAllFileImages(): void {
		this.loading = true;

		this.apiService.get('fileImages').subscribe({
			next: (resp: GenericApiResponse) => {
				this.filePictures = resp.data.pictures;
				this.loading = false;
			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loading = false;
			}
		});
	}
}
