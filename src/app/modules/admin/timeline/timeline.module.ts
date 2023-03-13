import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './main/main.component';
import { Route, RouterModule } from '@angular/router';

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
		RouterModule.forChild(routes)
	]
})
export class TimelineModule { }
