import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { GenericApiResponse, WarehouseFile } from 'app/models';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FileListComponent implements OnInit {
	files: WarehouseFile[] = [];
	loading = false;
	
    constructor(private apiService: ApiService, 
				private toaster: ToastrService,
				private fileSaverService: FileSaverService) 
	{ }

    ngOnInit(): void {
		this.getAllFiles();
    }

	private getAllFiles(): void {
		this.loading = true;

		this.apiService.get('files').subscribe({
			next: (resp: GenericApiResponse) => {
				this.loading = false;
				this.files = resp.data.files.map(file => {
					file.pictures = file.file_images.map(img => img.url);
					file.maxImagesToShow = 8;
					return file;
				});
			},
			error: (error: any) => {
				this.toaster.error(error);
				this.loading = false;
			}
		});
	}

	onDownloadFile(file: WarehouseFile): void {
		const zip = new JSZip()
		const folder = zip.folder('pictures');

		file.pictures.forEach((url)=> {
			const blobPromise = fetch(url).then(r => {
				if (r.status === 200) return r.blob()
				return Promise.reject(new Error(r.statusText))
			})
			const name = url.substring(url.lastIndexOf('/'))
			folder?.file(name, blobPromise)
		})
		
		zip.generateAsync({ type:"blob" }).then(content => {
			this.fileSaverService.save(content, 'file_pictures.zip');
		});
	}

	onGeneratePDFReport(file: WarehouseFile): void { }
}
