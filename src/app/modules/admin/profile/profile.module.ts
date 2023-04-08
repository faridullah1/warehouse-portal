import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from 'app/modules/material/material.module';

const routes: Route[] = [
	{
		path     : '',
		component: UserProfileComponent
	}
];

@NgModule({
  declarations: [
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
	  RouterModule.forChild(routes)
  ]
})
export class UserProfileModule { }
