import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, debounceTime, distinctUntilChanged, forkJoin, Subject, take } from 'rxjs';

// Services
import { ApiService } from 'app/api.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

// Models
import { TableAction, TableConfig, TableRowAction, TableSignal } from './models';
import { GenericApiResponse } from 'app/models';
import { WhereData } from './models';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
	@Input() config: TableConfig;
	@Input() actions = new Subject<TableAction>();

	@Output() signal = new EventEmitter<TableSignal>();
	@ViewChild(MatSort) sort: MatSort;

	selectedRow: any = null;
	dataSource: any;
	loading = false;
	displayedColumns: string[] = [];
	pageSizeOptions = [10, 15, 20, 25];
	totalRecords = 0;
	limit: number = 10;
	page: number = 1;
	dataError = false;

	searchFC = new FormControl();
	searchPlaceholder = 'Search by';

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	showError = () => this.dataError;

	// eslint-disable-next-line @typescript-eslint/member-ordering
	constructor(private apiService: ApiService,
				private confirmationService: FuseConfirmationService,
				private translocoService: TranslocoService,
				private cdr: ChangeDetectorRef)
	{
		this.dataSource = new MatTableDataSource();
	}

	ngOnInit(): void {
		// Subscribe to language changes
		this.translocoService.langChanges$.subscribe(() => {
			this.updateLanguage();
        });

		this.actions.subscribe((ac: TableAction) => {
			if (ac.type === 'reload') {
				this.selectedRow = null;
				this.loadData();
			}
		});

		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(val => this.searchData(val));

		if (this.config) {
			this.config.addBtnText = this.config.addBtnText || 'Add New';
			this.setTableColumns();
			this.loadData();
		}
	}


	updateLanguage(): void {{
		this.translocoService.selectTranslate(this.config.titleTranslationKey).pipe(take(1)).subscribe((translation: string) => {
			this.config.title = translation;
		});

		this.translocoService.selectTranslate(this.config.addBtnTextTranslationKey || 'Add_New').pipe(take(1)).subscribe((translation: string) => {
			this.config.addBtnText = translation;
		});

		combineLatest([
			this.translocoService.selectTranslate('Search_By'), 
			this.translocoService.selectTranslate(this.config.searchColumnTranslationKey)
		])
		.subscribe((res) => {
			this.searchPlaceholder = `${res[0]} ${res[1]}`;
		});

		for (const col of this.config.columns) {
			if (col.visible === false) {
				continue;
			};

			this.translocoService.selectTranslate(col.translationKey).pipe(take(1)).subscribe((translation: string) => {
				col.title = translation;
			});
		}
	}}

	setTableColumns(): void {
		for (const col of this.config.columns) {
			if (col.visible === false) {
				continue;
			};

			this.displayedColumns.push(col.name);
		}
	}

	loadData(search: string | null = null): void {
		let queryString = `?page=${this.page}&limit=${this.limit}`;

		if (this.config.where) {
			const whereQueryStr = this.handleWhere();
			queryString += `&${whereQueryStr}`;
		}

		if (search) {
			queryString += `&${search}`;
		}

		const slug = this.config.slug + queryString;

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => this.onAPIResponse(resp),
			error: (error: any) => this.handleError(error)
		});
	}

	onAPIResponse(resp: GenericApiResponse): void {
		this.loading = false;
		this.dataError = false;

		const { rows, count } = resp.data[this.config.slug];
		this.dataSource = rows;
		this.totalRecords = count;

		if (this.totalRecords === 0)
		{
			this.dataError = true;
			const r = {
				title: 'No Record Found',
				message: ''
			};

			this.dataSource = [r];
		}
	}

	handleError(error: string): void {
		this.loading = false;
		this.dataError = true;

		const r = {
			title: 'Error loading data',
			message: error
		};

		this.dataSource = [r];
		this.cdr.detectChanges();
	}

	searchData(value: string): void {
		if (value === '' || value == null) {
			this.loadData();
			return;
		}

		const searchCol = this.config.searchColumn;

		if (searchCol) {
			const queryStr = `${searchCol}=${value}`;
			this.loadData(queryStr);
		}
	}

	handleWhere(): string {
		const { column, search, op } = this.config.where as WhereData;

		let queryString = `${column}[${op}]=${search}`;

		switch(this.config?.where?.op) {
			case 'eq':
				queryString = `${column}=${search}`;
				break;

			case 'ne':
				queryString = `${column}[ne]=${search}`;

		}

		return queryString;
	}

	onAdd(): void {
		this.selectedRow = null;

		const signal: TableSignal = {
			type: 'OpenForm',
			row: null
		};

		this.signal.emit(signal);
	}

	onRefreshData(): void {
		this.selectedRow = null;
		this.searchData(this.searchFC.value);
	}

	onCellClick(event: Event, row: any): void {
		event.stopPropagation();

		const signal = {
			type: 'CellAction',
			row
		};

		this.signal.emit(signal);
	}

	onRowAction(ac: TableRowAction): void {
		const signal = {
			type: ac.action,
			row: this.selectedRow
		};

		this.signal.emit(signal);

		if (ac.action === 'OnPlay') {
			const audioObj = this.selectedRow.audioWav ? this.selectedRow.audioWav : this.selectedRow.audioMp3;
			const audio = new Audio(audioObj.url);
			audio.play();
		}

		if (ac.action === 'OnDelete') {
			const dialog = this.confirmationService.open({
				title: 'Are you sure you want to delete this user?',
				message: ''
			});

			dialog.afterClosed().subscribe((action: 'confirmed' | 'cancelled') => {
				if (action === 'confirmed') {
					this.apiService.delete(`${this.config.slug}/${this.selectedRow[this.config.primaryKey]}`).subscribe(() => {
						this.loadData();
					});

					this.selectedRow = null;
				}
			});
		}
	}

	onSortChange(ev: any): void {
		console.log('Table sort change =', ev);
	}

	onRowClick(row: any): void {
		if (row === this.selectedRow) {
			this.selectedRow = null;
			return;
		}

		this.selectedRow = row;
	}

	onPageChange(ev: PageEvent): void {
		this.limit = ev.pageSize;
		this.page = ev.pageIndex + 1;
		this.loadData();
	}
}
