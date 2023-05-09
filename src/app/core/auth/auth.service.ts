import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import jwt_decode  from 'jwt-decode';
import { User } from '../user/user.types';


@Injectable()
export class AuthService
{
	private baseUrl = environment.apiUrl;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
	get accessToken(): string
	{
		return localStorage.getItem('accessToken') ?? '';
	}

    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post(this.baseUrl + 'auth/adminLogin', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

				const { email, name, id, type } = jwt_decode(this.accessToken) as User;

                // Store the user on the user service
                this._userService.user = { id, name, email, type };

                // Return a new observable with the response
                return of(response);
            })
        );
    }

	/**
	 * Sign in
	 *
	 * @param credentials
	 */
    register(credentials: { email: string; password: string; company: false }): Observable<any>
    {
        return this._httpClient.post(this.baseUrl + 'companies', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.access_token;

				const { email, name, id} = jwt_decode(this.accessToken) as User;

                // Store the user on the user service
                this._userService.user = { id, name, email };

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Return the observable
        return of(true);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

		const { email, name, id, type, language } = jwt_decode(this.accessToken) as User;
		this._userService.user = { id, email, name, type, language };

		return of(true);
    }
}
