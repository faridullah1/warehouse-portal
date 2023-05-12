import { CommonModule, DecimalPipe, DatePipe} from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/modules/material/material.module';

import { FormatDataPipe } from '../generic-table/format.pipe';
import { TableComponent } from '../generic-table/table.component';
import { NestedValuePipe } from './nestedValue.pipe';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginationIntlService } from './mat-paginator-intl-service';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule
	],
	declarations: [
		TableComponent,

        FormatDataPipe,
		NestedValuePipe
	],
	exports: [
		TableComponent,
	],
	providers: [
		DatePipe,
		DecimalPipe,
		{ provide: MatPaginatorIntl, useClass: MatPaginationIntlService}
	]
})
export class GenericTableModule { }
