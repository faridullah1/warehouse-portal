import { Component, OnInit } from '@angular/core';
import { GenericApiResponse, User } from 'app/models';
import { ApiService } from 'app/api.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-profile',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class UserProfileComponent implements OnInit {
	profile: User;
	loading = false;

    constructor(private apiService: ApiService,
				private toastr: ToastrService)
	{ }

	ngOnInit(): void {
		this.getUserInfo();
	}

	getUserInfo(): void {
		this.loading = true;

		this.apiService.get('users/me').subscribe({
			next: (resp: GenericApiResponse) => {
				this.loading = false;
				this.profile = resp.data.user;
			},
			error: (error: any) => {
				this.loading = false;
				this.toastr.error(error);
			}
		});
	}
}
