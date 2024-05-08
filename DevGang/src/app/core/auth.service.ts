import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map, switchMap, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
interface SignupResponse {
  message: String,
  user: {username: String} // This allows the object to have other properties dynamically
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl; // Adjust to your backend server URL
  isLoggedInStatus=new BehaviorSubject<boolean>(false);
  private loggedInStatus = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
    this.checkInitialLoginStatus();
  }

  private checkInitialLoginStatus(): void {
    this.http.get<{ isLoggedIn: boolean }>(`${this.baseUrl}/api/auth/check`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error checking login status:', error);
          return of({ isLoggedIn: false });  // Ensure the flow continues
        })
      ).subscribe(response => this.loggedInStatus.next(response.isLoggedIn));
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }, {withCredentials: true}).pipe(
      tap(response => {
        console.log('Login successful:', response);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    // Call the backend to logout and then remove user from local state if needed
    this.http.get(`${this.baseUrl}/api/auth/logout`, {withCredentials: true}).subscribe(() => {
      console.log('Logged out successfully');
    });
  }

  signup(username: string, password: string): Observable<any> {
    return this.http.post<SignupResponse>(`${this.baseUrl}/signup`, { username, password }, { withCredentials: true })
      .pipe(
        tap((response) => console.log('Signup successful:', response)),
        filter((response) => response.message === 'Signup successful'),
        switchMap(signupResponse => {
          const demoProjectData = {name : "Demo Project", description: "This project is for demonstration", board : { name: "Demo Board", stages: ["To Do", "In Progress", "Done"]}}
          return this.http.post<{message:String,projectId:String}>(`${this.baseUrl}/create-project`, {username:signupResponse.user.username, projectData:{...demoProjectData}}, { withCredentials: true })
            .pipe(
              tap(projectResponse => console.log('Project creation successful:', projectResponse)),
              map(projectResponse => ({ signupResponse, projectResponse }))
            );
        }),
        switchMap(combinedResponse=>{
          console.log(combinedResponse)
          const demoIssueData = {summary:"issue Summary",issueType:"Epic",status:"To Do",projectId:combinedResponse.projectResponse.projectId}
          console.log(combinedResponse.projectResponse.projectId)
          console.log(demoIssueData.projectId);
          return this.http.post<{}>(`${this.baseUrl}/create-issue`,{issueData:{...demoIssueData},username:combinedResponse.signupResponse.user.username},{ withCredentials: true })
            .pipe(
              tap(issueResponse => console.log('Issue created :' ,issueResponse )),
              switchMap(issueResponse=>{
                console.log(issueResponse)
                const demoIssueData = {summary:"issue Summary",issueType:"Epic",status:"In Progress",projectId:combinedResponse.projectResponse.projectId}
                console.log(combinedResponse.projectResponse.projectId)
                console.log(demoIssueData.projectId);
                return this.http.post<{}>(`${this.baseUrl}/create-issue`,{issueData:{...demoIssueData},username:combinedResponse.signupResponse.user.username},{ withCredentials: true })
                  .pipe(
                    tap(issueResponse2 => console.log('Issue created :' ,issueResponse2 )),
                    map(issueResponse2 => ({...combinedResponse,issueResponse2}))
                  )
              }),
              map(issueResponse => ({...combinedResponse,issueResponse}))
            )
        }),
        catchError(error => {
          console.error('Signup error:', error);
          return throwError(() => error);
        })
      );
  }

   isLoggedIn(): Observable<boolean>{
    console.log('Testing browser logging');
    return this.http.get<{ isLoggedIn: boolean }>(`${this.baseUrl}/api/auth/check`, { withCredentials: true }).pipe(
      tap(response=> {console.log('response inside auth',response.isLoggedIn)}),
      map(response => {
        return response.isLoggedIn
      }),
      catchError(error => {
        console.error('Error checking login status:', error);
        return of(false);
      })
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/auth/currentUser`, { withCredentials: true }).pipe(
      tap(response => console.log('Current user:', response)),
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(() => error); // or return of({}) to return an empty object
      })
    );
  }
}
