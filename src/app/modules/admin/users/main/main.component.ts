import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { TableAction, TableConfig, TableSignal } from 'app/shared/generic-table/models';
import { Subject } from 'rxjs';
import { UserFormComponent } from '../add-user-form/user-form.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class UsersComponent {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();

    constructor(private dialog: MatDialog) {
		this.tableConfig = {
			title: 'Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'name',

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete' },
			],

			columns: [
				{ name: 'name', title: 'Name' },
				{ name: 'email', title: 'Email' },
				{ name: 'username', title: 'Username' },
				{ name: 'type', title: 'Type' },
				{ name: 'department.name', title: 'Department' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime' },
			]
		};
	}

    onTableSignal(ev: TableSignal): void {
		switch(ev.type) {
			case 'OpenForm':
				this.onHandleUser();
				break;

			case 'OnEdit':
				this.onHandleUser(ev.row);
				break;
		}
	}

	onHandleUser(row = null): void {
		const dialog = this.dialog.open(UserFormComponent, {
			width: '40%',
			maxHeight: '90%',
			height: '90%'
		});

		if (row) {
			dialog.componentInstance.id = row.userId;
		}

		dialog.afterClosed().subscribe((resp: boolean) => {
			if (resp) {
				this.actions.next({ type: 'reload'});
			}
		});
	}
}
