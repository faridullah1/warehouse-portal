import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { GenericApiResponse } from 'app/models';


@Component({
  selector: 'update-file',
  templateUrl: './update-file.component.html',
  styleUrls: ['./update-file.component.scss']
})
export class UpdateFileComponent implements OnInit {
	fileId: number;
	theForm: FormGroup;
	disableUpdateBtn = false;

    constructor(private apiService: ApiService,
				private dialogRef: MatDialogRef<UpdateFileComponent>,
				private toaster: ToastrService)
	{
		this.theForm = new FormGroup({
			reference: new FormControl('', Validators.required),
			containerNumber: new FormControl(''),
		});
	}

	ngOnInit(): void {
		if (this.fileId) {
			this.getFile();
		}
	}

	getFile(): void {
		this.apiService.get(`files/${this.fileId}`).subscribe({
			next: (resp: GenericApiResponse) => this.theForm.patchValue(resp.data.file),
			error: (error: any) => this.toaster.error(error)
		});
	}

	onSubmit(): void {
		this.disableUpdateBtn = true;

		this.apiService.patch(`files/${this.fileId}`, this.theForm.value).subscribe({
			next: () => {
				this.disableUpdateBtn = false;
				this.dialogRef.close(true);
			},
			error: (error: any) => {
				this.disableUpdateBtn = false;
				this.toaster.error(error);
			}
		});
	}
}
