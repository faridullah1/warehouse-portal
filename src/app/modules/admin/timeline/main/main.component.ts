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
	filePictures: FilePicture[];

    constructor(private apiService: ApiService, 
				private toaster: ToastrService) 
	{ }

    ngOnInit(): void {
		this.getAllFileImages();
    }

	getAllFileImages(): void {
		this.apiService.get('fileImages').subscribe({
			next: (resp: GenericApiResponse) => this.filePictures = resp.data.pictures,
			error: (error: any) => this.toaster.error(error)
		});
	}

	private getFileName = (path: string) => path.substring(path.lastIndexOf('/') +1);

	onDownload(image: string): void {
		// creating an invisible element
		const element = document.createElement('a');

		element.setAttribute('href', image);
		element.setAttribute('download', this.getFileName(image));
	 
		// Above code is equivalent to
		// <a href="path of file" download="file name">
		document.body.appendChild(element);
	 
		// onClick property
		element.click();
	 
		document.body.removeChild(element);
	}
}
