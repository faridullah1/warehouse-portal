import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
	private baseUrl = environment.apiUrl;

  	constructor(private http: HttpClient, private router: Router) { }

	get(slug: string): Observable<any> {
		return this.http.get(this.baseUrl + slug).pipe(catchError(error => this.handleError(error)));
	}

	post(slug: string, payload: any): Observable<any> {
		return this.http.post(this.baseUrl + slug, payload).pipe(catchError(error => this.handleError(error)));
	}

	patch(slug: string, payload: any): Observable<any> {
		return this.http.patch(this.baseUrl + slug, payload).pipe(catchError(error => this.handleError(error)));
	}

	delete(slug: string): Observable<any> {
		return this.http.delete(this.baseUrl + slug).pipe(catchError(error => this.handleError(error)));
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	private handleError(err: HttpErrorResponse) {
		let errorMessage = err.error.message || err.message;

		if (err.status === 401) {
			this.router.navigateByUrl('/login');
		}

		if (err.status === 504) {
			errorMessage = 'Gateway Timeout';
		}

		return throwError(() => new Error(errorMessage));
	}
}