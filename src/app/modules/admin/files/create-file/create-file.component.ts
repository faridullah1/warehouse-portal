import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'app/api.service';


@Component({
  selector: 'create-file',
  templateUrl: './create-file.component.html',
  styleUrls: ['./create-file.component.scss']
})
export class CreateFileComponent {
	@ViewChild('uploadFilesField') uploadFilesField: ElementRef<HTMLInputElement>;

	allowedFileTypes = ['.jpg', '.jpeg', '.png'];
	files: File[] = [];
	theForm: FormGroup;
	disableCreateBtn = false;

    constructor(private apiService: ApiService,
				private dialogRef: MatDialogRef<CreateFileComponent>,
				private toaster: ToastrService)
	{
		this.theForm = new FormGroup({
			reference: new FormControl('', Validators.required),
			containerNumber: new FormControl(''),
			isDamaged: new FormControl(false)
		});
	}

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
		this.disableCreateBtn = true;
		const { reference, containerNumber, isDamaged } = this.theForm.value;

		const formData: any = new FormData();
		for (const file of this.files) {
			formData.append('pictures', file);
		}

		formData.append('reference', reference);
		formData.append('containerNumber', containerNumber);
		formData.append('isDamaged', isDamaged);

		this.apiService.post('files', formData).subscribe({
			next: () => {
				this.disableCreateBtn = false;
				this.dialogRef.close(true);
			},
			error: (error: any) => {
				this.disableCreateBtn = false;
				this.toaster.error(error);
			}
		});
	}
}
