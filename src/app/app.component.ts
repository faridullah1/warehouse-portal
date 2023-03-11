import { FuseNavigationService } from '@fuse/components/navigation';
import { Component } from '@angular/core';
import { QuoteManagementAppNavigation } from './layout/common/navigation';
import { UserService } from './core/user/user.service';
import { Navigation } from './core/navigation/navigation.types';
import { take } from 'rxjs';
import { User } from './models';


@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
	/**
	 * Constructor
	 */
	constructor(private _fuseNavigationService: FuseNavigationService, private userService: UserService)
	{
		this.userService.user$.pipe(take(1)).subscribe((user: User) => {
			const navigation = this.updateMenuAccordingPermission(user);
			this._fuseNavigationService.storeNavigation('main', navigation);
		});
	}

	updateMenuAccordingPermission(user: User): any {
		const navigation: Navigation = {
			default: [],
			horizontal: []
		};

		for (let item of QuoteManagementAppNavigation.navigation.default) {
			if (item?.company && !user.company) continue;

			navigation.default.push(item);
		}

		for (let item of QuoteManagementAppNavigation.navigation.horizontal) {
			if (item?.company && !user.company) continue;

			navigation.horizontal.push(item);
		}

		return navigation;
	}
}
