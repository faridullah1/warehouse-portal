import { FuseNavigationService } from '@fuse/components/navigation';
import { Component } from '@angular/core';
import { Kolli_App_Navigation } from './layout/common/navigation';


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
	constructor(private _fuseNavigationService: FuseNavigationService)
	{
		this._fuseNavigationService.storeNavigation('main', Kolli_App_Navigation.navigation);
	}
}
