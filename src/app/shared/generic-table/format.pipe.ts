import { DatePipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TableFormat } from './models';

@Pipe({
    name: 'format'
})
export class FormatDataPipe implements PipeTransform {
    constructor(private dateFormater: DatePipe, private numberFormater: DecimalPipe) {}

    transform(value: any, format?: TableFormat): any {
		if (!format) {
			return value;
		}

		switch(format) {
			case 'date':
				// incase of timestamp
				const dateValue = typeof value === 'number' ? new Date(value).getTime() * 1000 : value;
				return this.dateFormater.transform(dateValue, 'dd MMM YYYY');

			case 'datetime':
				const dateTimeValue = typeof value === 'number' ? new Date(value).getTime() * 1000 : value;
				return this.dateFormater.transform(dateTimeValue, 'dd MMM YYYY hh:mm');

			case 'number':
				return this.numberFormater.transform(value);

			case 'boolean':
				return value ? 'Yes' : 'No';
		}
    }
}
