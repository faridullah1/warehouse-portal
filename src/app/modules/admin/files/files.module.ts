import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';

const routes: Route[] = [
	{
		path     : '',
		component: FileListComponent
	}
];

@NgModule({
	declarations: [
		FileListComponent
	],
	imports: [
		CommonModule,
		FuseCardModule,
		MaterialModule,
		RouterModule.forChild(routes)
	]
})
export class FilesModule { }
