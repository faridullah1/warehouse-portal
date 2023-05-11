import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { GenericApiResponse } from '../../../../models';
import Validation from 'app/shared/validators';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, take } from 'rxjs';

interface Lang {
	name: string;
	title: string;
}

interface UserType {
	name: string;
	title: string;
}

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
	id: string;
	theForm: FormGroup;
	disableSaveBtn = false;
	userTypes: UserType[] = [];
	languages: Lang[];
	title: string;
	submitBtnText: string;

	constructor(private apiService: ApiService,
				private fb: FormBuilder,
				private toastr: ToastrService,
				private translocoService: TranslocoService,
				private dialogRef: MatDialogRef<UserFormComponent>)
	{
		this.theForm = fb.group({
			name: [null, [Validators.required]],
			username: [null, [Validators.required]],
			email: [null, [Validators.required, Validators.email]],
			type: ['User', [Validators.required]],
			language: ['nl', [Validators.required]],
			password: [null, [Validators.required]],
			confirmPassword: [null, [Validators.required]],
			departmentId: [1]
		}, { validators: [Validation.match('password', 'confirmPassword')]});

		this.languages = [
			{ name: 'en', title: 'English' },
			{ name: 'nl', title: 'Nederlands' }
		];
	}

	ngOnInit(): void {
		this.updateLanguage();

		if (this.id) {
			this.theForm.removeControl('password');
			this.theForm.removeControl('confirmPassword');
			this.getUser();
		}
	}

	updateLanguage(): void {
		combineLatest([this.translocoService.selectTranslate('User'), this.translocoService.selectTranslate('Admin')])
		.subscribe((res) => {
			this.userTypes = [
				{ name: 'User', title: res[0] },
				{ name: 'Admin', title: res[1] }
			];
		});

		if (this.id) {
			this.translocoService.selectTranslate('Update_User').pipe(take(1)).subscribe((translation: string) => {
				this.title = translation;
			});

			this.translocoService.selectTranslate('Update').pipe(take(1)).subscribe((translation: string) => {
				this.submitBtnText = translation;
			});
		}
		else {
			this.translocoService.selectTranslate('Add_User').pipe(take(1)).subscribe((translation: string) => {
				this.title = translation;
			});

			this.translocoService.selectTranslate('Save').pipe(take(1)).subscribe((translation: string) => {
				this.submitBtnText = translation;
			});
		}
	}

	getUser(): void {
		this.apiService.get(`users/${this.id}`).subscribe({
			next: (resp: GenericApiResponse) => this.theForm.patchValue(resp.data['user']),
			error: (error: any) => this.toastr.error(error)
		});
	}

	onSave(): void {
		const payload = this.theForm.value;
		payload.confirmPassword = undefined;
		this.disableSaveBtn = true;

		if (this.id) {
			this.apiService.patch(`users/${this.id}`, payload).subscribe({
				next: () => {
					this.disableSaveBtn = false;
					this.dialogRef.close(true);
				},
				error: (error: any) => {
					this.disableSaveBtn = false;
					this.toastr.error(error);
				}
			});
		}
		else {
			this.apiService.post('users', payload).subscribe({
				next: () => {
					this.disableSaveBtn = false;
					this.dialogRef.close(true);
				},
				error: (error: any) => {
					this.disableSaveBtn = false;
					this.toastr.error(error);
				}
			});
		}
	}
}
