import { FuseNavigationService } from '@fuse/components/navigation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Kolli_App_Navigation } from './layout/common/navigation';
import { TranslocoService } from '@ngneat/transloco';
import { UserService } from './core/user/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
	subscription: Subscription;

	/**
	 * Constructor
	 */
	constructor(private _fuseNavigationService: FuseNavigationService,
				private userService: UserService,
				private translocoService: TranslocoService)
	{
		this._fuseNavigationService.storeNavigation('main', Kolli_App_Navigation.navigation);
	}

	ngOnInit(): void {
		this.subscription = this.userService.user$.subscribe((user) => {
			if (user.language) {
				this.translocoService.setActiveLang(user.language);
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.subscription = null;
	}
}
