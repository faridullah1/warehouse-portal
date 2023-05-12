import { SearchFilterComponent } from '../../../shared/search-filter/search-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileListComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FirstEightPipe } from './main/first-eight.pipe';
import { UploadPicturesToExistingFileComponent } from './upload-new-pictures/upload-pictures.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { DialogHeaderComponent } from 'app/shared/dialog-header/dialog-header.component';
import { CreateFileComponent } from './create-file/create-file.component';
import { UpdateFileComponent } from './update-file/update-file.component';
import { TranslocoModule } from '@ngneat/transloco';

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
		UploadPicturesToExistingFileComponent,
    	FileDetailComponent,
		CreateFileComponent,
		UpdateFileComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FuseCardModule,
		MaterialModule,
		DialogHeaderComponent,
		RouterModule.forChild(routes),
		TranslocoModule,
		SearchFilterComponent
	]
})
export class FilesModule { }
