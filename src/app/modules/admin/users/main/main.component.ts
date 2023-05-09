import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableAction, TableConfig, TableSignal } from 'app/shared/generic-table/models';
import { Subject, Subscription } from 'rxjs';
import { UserFormComponent } from '../add-user-form/user-form.component';
import { User } from 'app/models';
import { UserService } from 'app/core/user/user.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
	tableConfig: TableConfig;
	actions = new Subject<TableAction>();
	subscription = new Subscription();
	user: User;

    constructor(private dialog: MatDialog, private userService: UserService) {
		this.tableConfig = {
			title: 'Users',
			titleTranslationKey: 'Users',
			slug: 'users',
			primaryKey: 'userId',

			showAdd: true,
			showSearch: true,

			searchColumn: 'name',

			rowActions: [
				{ name: 'edit', title: 'Edit', action: 'OnEdit' },
				{ name: 'delete', title: 'Delete', action: 'OnDelete', condition: this.showDeleteButton },
			],

			columns: [
				{ name: 'name', title: 'Name', translationKey: 'Name' },
				{ name: 'email', title: 'Email', translationKey: 'Email' },
				{ name: 'username', title: 'Username', translationKey: 'Username' },
				{ name: 'type', title: 'Type', translationKey: 'User_Type' },
				{ name: 'department.name', title: 'Department', translationKey: 'Department' },
				{ name: 'createdAt', title: 'Date Created', format: 'datetime', translationKey: 'Created_At' },
			]
		};
	}

	ngOnInit(): void {
		this.subscription = this.userService.user$.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.subscription = null;
	}

	showDeleteButton = (user: User): boolean => user.userId !== this.user?.userId;

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
