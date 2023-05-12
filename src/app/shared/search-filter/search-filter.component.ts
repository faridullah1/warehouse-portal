import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MaterialModule } from 'app/modules/material/material.module';
import { debounceTime, distinctUntilChanged, take } from 'rxjs';
import { CreateFileComponent } from '../../modules/admin/files/create-file/create-file.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FuseCardModule } from '@fuse/components/card';
import { CommonModule } from '@angular/common';

export const MY_FORMATS = {
	parse: {
	  	dateInput: 'L',
	},
	display: {
		dateInput: 'L',
		monthYearLabel: 'MM YYYY',
		dateA11yLabel: 'L',
		monthYearA11yLabel: 'MM YYYY',
	}
};

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FuseCardModule, TranslocoModule],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SearchFilterComponent implements OnInit {
	@Output() signal = new EventEmitter();

	searchPlaceholder: string;
	startDatePlaceholder: string;
	endDatePlaceholder: string;

	filters: FormGroup;

	constructor(private dialog: MatDialog,
				private translocoService: TranslocoService)
	{
		this.filters = new FormGroup({
			reference: new FormControl(''),
			isDamaged: new FormControl(false),
			range: new FormGroup({
				start: new FormControl<Date | null>(null),
				end: new FormControl<Date | null>(null),
			})
		});

		this.filters.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((form: any) => {
			this.signal.emit({ type: 'FilterChange', data: this.filters.value });
		});
	}

	ngOnInit(): void {
		// Subscribe to language changes
		this.translocoService.langChanges$.subscribe(() => {
			this.translocoService.selectTranslate('File_Search_Placeholder').pipe(take(1)).subscribe((translation: string) => {
				this.searchPlaceholder = translation;
			});

			this.translocoService.selectTranslate('Start_Date_Placeholder').pipe(take(1)).subscribe((translation: string) => {
				this.startDatePlaceholder = translation;
			});

			this.translocoService.selectTranslate('End_Date_Placeholder').pipe(take(1)).subscribe((translation: string) => {
				this.endDatePlaceholder = translation;
			});
        });
	}

	onReset(): void {
		this.filters.reset();
	}

	onCreateFile(): void {
		const dialog = this.dialog.open(CreateFileComponent, {
			width: '25vw'
		});

		dialog.afterClosed().subscribe((resp) => {
			if (resp) {
				this.signal.emit({ type: 'LoadFiles', data: null });
			}
		});
	}
}
