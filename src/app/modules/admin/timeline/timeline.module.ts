import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from './../../material/material.module';
import { ImageNamePipe } from './main/image-name.pipe';
import { FuseCardModule } from '@fuse/components/card';
import { TranslocoModule } from '@ngneat/transloco';

const routes: Route[] = [
    {
        path     : '',
        component: TimelineComponent
    }
];

@NgModule({
	declarations: [
		TimelineComponent,

		ImageNamePipe
	],
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule,
		FuseCardModule,
		TranslocoModule,
		RouterModule.forChild(routes)
	]
})
export class TimelineModule { }
