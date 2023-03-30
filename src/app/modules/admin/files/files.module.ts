import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FirstEightPipe } from './main/first-eight.pipe';
import { UploadFileComponent } from './upload-file/upload-file.component';

const routes: Route[] = [
	{
		path     : '',
		component: FileListComponent
	}
];

@NgModule({
	declarations: [
		FileListComponent,
		FirstEightPipe,
  		UploadFileComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FuseCardModule,
		MaterialModule,
		RouterModule.forChild(routes)
	]
})
export class FilesModule { }
