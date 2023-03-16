import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from './../../material/material.module';

const routes: Route[] = [
    {
        path     : '',
        component: TimelineComponent
    }
];

@NgModule({
	declarations: [
		TimelineComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
		RouterModule.forChild(routes)
	]
})
export class TimelineModule { }
