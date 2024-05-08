import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl
  private apiBaseUrl = `${this.baseUrl}/api`; // Base URL for the API

  constructor(private http: HttpClient) {}

  // HTTP GET method to retrieve resources
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiBaseUrl}/${endpoint}`, { withCredentials: true })
      .pipe(
        retry(3), // Retry this request up to 3 times
        catchError(this.handleError) // Handle errors
      );
  }

  // HTTP POST method to create a new resource
  post<T>(endpoint: string, data: Object): Observable<T> {
    return this.http.post<T>(`${this.apiBaseUrl}/${endpoint}`, data, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // HTTP PUT method to update an existing resource
  put<T>(endpoint: string, data: Object): Observable<T> {
    return this.http.put<T>(`${this.apiBaseUrl}/${endpoint}`, data, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // HTTP DELETE method to delete a resource
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiBaseUrl}/${endpoint}`, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle API errors
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
