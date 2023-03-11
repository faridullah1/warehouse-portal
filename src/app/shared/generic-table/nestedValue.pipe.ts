import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'nestedValue'
})
export class NestedValuePipe implements PipeTransform {
    constructor() {}

    transform(value: any, col: string, row: any): any {
		const keys = col.split('.');

		if (keys.length > 1) {
			if (row[keys[0]]) {
				if (keys.length === 2) {
					return row[keys[0]][keys[1]];
				}
				else if (keys.length === 3) {
					return row[keys[0]][keys[1]][keys[2]];
				}
			}
		}

		return value;
    }
}
