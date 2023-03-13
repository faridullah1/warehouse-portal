import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';


const modules: any[] = [
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatCardModule,
	MatCheckboxModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatDividerModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatTableModule,
	MatPaginatorModule,
	MatDialogModule,
	MatChipsModule,
	MatSelectModule,
	MatMenuModule
];

@NgModule({
  declarations: [],
  imports: [ ...modules ],
  exports: [ ...modules ]
})
export class MaterialModule { }
