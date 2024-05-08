import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserServiceService } from '../../../user-service.service';
import { isPlatformBrowser } from '@angular/common';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { IssueResponse, ProjectResponse } from '../../../models/common.model';
import { CommonModule } from '@angular/common';
import { AppState, selectCurrentProjectId } from '../../../project.selectors';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-assigned-to-me',
  standalone: true,
  imports: [MatButtonModule,MatMenuModule,CommonModule],
  templateUrl: './assigned-to-me.component.html',
  styleUrl: './assigned-to-me.component.css'
})
export class AssignedToMeComponent {
  private baseUrl = environment.baseUrl
  projects: ProjectResponse = {projects:[]};
  issues: IssueResponse = {issues:[]};
  private projectIdSubscription!: Subscription;
  constructor(private http: HttpClient,private userService:UserServiceService,@Inject(PLATFORM_ID) private platformId: Object,private cdr: ChangeDetectorRef,private store: Store<AppState>) {}

  getToDoIssues() {
    return this.issues?.issues?.filter(issue => issue.status === 'To Do');
  }

  getInProgressIssues() {
    return this.issues?.issues?.filter(issue => issue.status === 'In Progress');
  }

  ngOnInit(): void {
    this.fetchData();
    this.projectIdSubscription = this.store.select(selectCurrentProjectId).subscribe(projectId => {
      this.fetchData();
    });
  }

  private fetchData(): void {
    interface ProjectResponse {
      projects: Project[];
  }
  
  interface Project {
      _id: string;
      name: string;
      description: string;
      board: any; // Define more specifically if possible
      issues: any[]; // Define more specifically if possible
  }
  interface IssueResponse{
    issues: Issue[];
  }
  interface Issue{
    _id: String;
    summary: string;
    description?: string; 
    issueType: string;
    assignee?: string; 
    labels?: string[]; 
    parent?: string; 
    reporter?: string;
    status: string;
    projectId: string; 
    attachment?: string[];
  }
    let username=this.userService.getUsername()
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
        if((username==null || username =='') && storedUsername!=null){
          username=storedUsername;
        }
    }
    const optionsForGettingProjects = {
      params: { username: username }, // This adds the username as a query parameter
      withCredentials: true // This is to send cookies or auth headers with the request
  };
  if(username!=''&&username!=null){
  this.http.get<ProjectResponse>(`${this.baseUrl}/projects`, optionsForGettingProjects).pipe(
        catchError(error => {
            console.error('Error fetching projects', error);
            return of({ projects: [] }); // Return empty array as a fallback
        }),
        switchMap(response => {
          this.projects = response; // Save projects data immediately once fetched
            if (response.projects.length > 0 ) {
                // Setup options for second HTTP request based on data from the first
                let currentProjectId = sessionStorage.getItem('currentProjectId') as string;
                let projectId : string;
                if(currentProjectId!=null||currentProjectId!=''){
                  projectId = sessionStorage.getItem('currentProjectId') as string;
                }
                else{
                  projectId = response.projects[0]._id;
                }
                const optionsForGettingIssues = {
                    params: { projectId: projectId},
                    withCredentials: true
                };
                return this.http.get<IssueResponse>(`${this.baseUrl}/issues`, optionsForGettingIssues).pipe(
                    catchError(error => {
                        console.error('Error fetching issues', error);
                        return of({ issues: [] }); // Return empty array as a fallback
                    })
                );
            } else {
                return of({ issues: [] }); // Return empty array if no projects
            }
        })
    ).subscribe((issues:IssueResponse) => {
      this.issues = issues; // Save issues data once fetched
  });
  }
}

}
