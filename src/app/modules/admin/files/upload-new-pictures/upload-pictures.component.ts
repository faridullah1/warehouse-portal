import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'app/api.service';


@Component({
  selector: 'upload-new-pictures',
  templateUrl: './upload-pictures.component.html',
  styleUrls: ['./upload-pictures.component.scss']
})
export class UploadPicturesToExistingFileComponent {
	@ViewChild('uploadFilesField') uploadFilesField: ElementRef<HTMLInputElement>;

	fileId: number;
	allowedFileTypes = ['.jpg', '.jpeg', '.png'];
	files: File[] = [];
	isDamaged = new FormControl(false);
	disableSaveBtn = false;

    constructor(private apiService: ApiService,
				private dialogRef: MatDialogRef<UploadPicturesToExistingFileComponent>,
				private toaster: ToastrService)
	{ }

    onFileChange(): void {
		const allFiles = this.uploadFilesField.nativeElement.files;

		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let i=0; i<allFiles.length; i++) {
			const file = allFiles.item(i);
			this.files.push(file);
		}
	}

	onUploadFile(): void
	{
		this.uploadFilesField.nativeElement.value = '';
		this.uploadFilesField.nativeElement.click();
	}

	onRemoveFile(file: File): void {
		const idx = this.files.indexOf(file);
		this.files.splice(idx, 1);
	}

	onSubmit(): void {
		this.disableSaveBtn = true;

		const formData: any = new FormData();
		for (const file of this.files) {
			formData.append('pictures', file);
		}
		formData.append('isDamaged', this.isDamaged.value);

		this.apiService.patch(`files/${this.fileId}`, formData).subscribe({
			next: () => {
				this.disableSaveBtn = false;
				this.dialogRef.close(true);
			},
			error: (error: any) => {
				this.disableSaveBtn = false;
				this.toaster.error(error);
			}
		});
	}
}
