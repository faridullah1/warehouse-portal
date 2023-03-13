import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import { GenericApiResponse, WarehouseFile } from 'app/models';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class FileListComponent implements OnInit {
	files: WarehouseFile[] = [];
	
    constructor(private apiService: ApiService, private toaster: ToastrService) { }

    ngOnInit(): void {
		this.getAllFiles();
    }

	getAllFiles(): void {
		this.apiService.get('files').subscribe({
			next: (resp: GenericApiResponse) => this.files = resp.data.files,
			error: (error: any) => this.toaster.error(error)
		});
	}
}
