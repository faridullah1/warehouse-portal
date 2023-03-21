import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { FilePicture, GenericApiResponse, WarehouseFile } from 'app/models';
import * as JSZip from 'jszip';
import { FileSaverService } from 'ngx-filesaver';
import { jsPDF } from "jspdf";
import moment from 'moment';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FileListComponent implements OnInit {
	files: WarehouseFile[] = [];
	loadingFiles = false;
	
    constructor(private apiService: ApiService, 
				private toaster: ToastrService,
				private fileSaverService: FileSaverService) 
	{ }

    ngOnInit(): void {
		this.getAllFiles();
    }

	private getAllFiles(): void {
		this.loadingFiles = true;

		this.apiService.get('files').subscribe({
			next: (resp: GenericApiResponse) => {
				this.loadingFiles = false;
				this.files = resp.data.files.map(file => {
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

	getFileName = (path: string) => path.substring(path.lastIndexOf('/') +1);
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
		doc.text('112223', 160, istRowX);


		// Sub Heading
		doc.setFontSize(14);
		doc.text('Damaged goods: ', 10, secondRowX);
		// Text
		doc.setFontSize(10);
		doc.text('1', 50, secondRowX);
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

	async onGeneratePDFReport(file: WarehouseFile) {
		// Create a new document
		const doc = new jsPDF();

		// Summary of file report
		this.getFileReportSummary(doc, file);

		// Add images to pdf
		this.addFilePicsToPDF(doc, file);

		doc.save("file.pdf");
	}
}
