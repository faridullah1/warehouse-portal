import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';


@Injectable()
export class MatPaginationIntlService extends MatPaginatorIntl {
  constructor(private translateService: TranslocoService) {
    super();

    // Subscribe to language changes
		this.translateService.langChanges$.subscribe(() => {
			this.translateLabels();
    });

    // Initialize the translations once at construction time
    this.translateLabels();
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const currentLang = this.translateService.getActiveLang();
    const of = this.translateService.getTranslation(currentLang)['Pagination_Of'];

    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);

    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  translateLabels(): void {
    this.translateService.selectTranslate('Items_Per_Page').pipe(take(1)).subscribe((translation) => {
      this.itemsPerPageLabel = translation;
      this.changes.next(); // Fire a change event to make sure that the labels are refreshed
    });
  }
}
