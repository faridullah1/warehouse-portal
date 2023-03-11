import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './main/main.component';
import { GenericTableModule } from 'app/shared/generic-table/module';
import { MaterialModule } from 'app/modules/material/material.module';
import { Route, RouterModule } from '@angular/router';
import { UserFormComponent } from './add-user-form/user-form.component';

const routes: Route[] = [
	{
		path     : '',
		component: UsersComponent
	}
];

@NgModule({
  declarations: [
    UsersComponent,
	  UserFormComponent
  ],
  imports: [
    CommonModule,
	  ReactiveFormsModule,
    GenericTableModule,
    MaterialModule,
	  RouterModule.forChild(routes)
  ]
})
export class UsersModule { }
