import { FuseNavigationService } from '@fuse/components/navigation';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Kolli_App_Navigation } from './../../../layout/common/navigation';


@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
		private _fuseNavigationService: FuseNavigationService
    )
    { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid)
        {
			this.signInForm.get('email').markAsTouched();
			this.signInForm.get('password').markAsTouched();

            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

		const payload = this.signInForm.value;

        // Sign in
		this._authService.signIn(payload).subscribe({
			next: (resp) => {
				// Set the redirect url.
				// The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
				// to the correct page after a successful sign in. This way, that url can be set via
				// routing file and we don't have to touch here.
				const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

				this._fuseNavigationService.storeNavigation('main', Kolli_App_Navigation.navigation);

				// Navigate to the redirect url
				this._router.navigateByUrl(redirectURL);
			},
			error: (error) => {
				// Re-enable the form
				this.signInForm.enable();

				// Set the alert
				this.alert = {
					type   : 'error',
					message: error.error.message
				};

				// Show the alert
				this.showAlert = true;
			}
		});
    }
}
