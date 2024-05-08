import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Issue } from '../models/issue.model';  // Adjust the path as necessary
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment.development';
export interface IssuesResponse {
  issuesByProject: { [key: string]: Issue[] };
  issues: Issue[];
  projects: Project[];
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private baseUrl = environment.baseUrl;  // URL to web API

  constructor(private http: HttpClient) {}

  // Get all issues
  getIssues(): Observable<IssuesResponse> {
    return this.http.get<IssuesResponse>(`${this.baseUrl}/getAllIssues`,{withCredentials:true})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle Errors
  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
