import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Subscription } from 'rxjs'; // RxJS operator for handling multiple concurrent requests
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserServiceService } from '../../user-service.service';
import { isPlatformBrowser } from '@angular/common';
import { IssueResponse, ProjectResponse } from './types';
import { CommonModule } from '@angular/common';
import { IssueStatusFilterPipe } from './issue-status-filter.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Project } from './types';
import { Issue } from './types';
import { AppState, selectCurrentProjectId } from '../../project.selectors';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule,IssueStatusFilterPipe,DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})

export class KanbanComponent implements OnInit {
  private baseUrl = environment.baseUrl
  projects: ProjectResponse = {projects:[]};
  issues: IssueResponse = {issues:[]};
  private projectIdSubscription!: Subscription;
  currentProjectId: string | null = '';
  constructor(private http: HttpClient,private userService:UserServiceService,@Inject(PLATFORM_ID) private platformId: Object,private cdr: ChangeDetectorRef,private store: Store<AppState>,private router: Router,private mainLayout: MainLayoutComponent) {}

  ngOnInit(): void {
    this.currentProjectId = sessionStorage.getItem('currentProjectId');
    this.fetchData();
    this.projectIdSubscription = this.store.select(selectCurrentProjectId).subscribe(projectId => {
      this.fetchData();
    });
    
  }
  get currentProject() {
    return this.projects.projects.find(project => project._id === this.currentProjectId);
  }
  getIssuesByStatus(status: string) {
    return this.issues?.issues?.filter(issue => issue.status === status);
  }

  drop(event: CdkDragDrop<Issue[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update the issue status and potentially re-render or re-fetch data
      const draggedElement = event.item.element.nativeElement;
        const issueId = draggedElement.getAttribute('data-id');
        const issueToUpdate = this.issues.issues.find(issue => issue._id === issueId);
        if (issueToUpdate) {
            issueToUpdate.status = newStatus; // Assuming 'newStatus' is defined as the target column's status
            this.updateIssueStatus(issueToUpdate);
        }
      this.cdr.detectChanges();
    }
  }

  updateIssueStatus(issue: Issue) {
    const url = `${this.baseUrl}/issues/${issue._id}/update`;
    const updatePayload = { status: issue.status };
    this.http.put(url, updatePayload, { withCredentials: true }).subscribe(
      success => console.log('Issue status updated', success),
      error => console.error('Error updating issue status', error)
    );
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
            if(error.error.message=='User not authenticated'){
              this.mainLayout.notLoggedIn()
              this.router.navigate(['/login']);
            }
            return of({ projects: [] }); // Return empty array as a fallback
        }),
        switchMap(response => {
          this.projects = response; // Save projects data immediately once fetched
            if (response.projects.length > 0 ) {
                // Setup options for second HTTP request based on data from the first
                let currentProjectId = sessionStorage.getItem('currentProjectId')
                let projectId : string;
                if(currentProjectId!=null||currentProjectId!=''){
                  projectId = sessionStorage.getItem('currentProjectId') as string;
                  this.currentProjectId=sessionStorage.getItem('currentProjectId') as string;
                }
                else{
                  projectId = response.projects[0]._id;
                  this.currentProjectId=response.projects[0]._id;
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
  else{
      this.mainLayout.notLoggedIn()
      this.router.navigate(['/login']);
  }
  //   const projectsRequest = this.http.get<any[]>('http://localhost:3000/projects',optionsForGettingProjects).pipe(
  //     catchError(error => {
  //       console.error('Error fetching projects', error);
  //       return of([]); // Return empty array as a fallback
  //     })
  //   );
  //   const optionsForGettingIssues = {
  //     params: { username: username }, // This adds the username as a query parameter
  //     withCredentials: true // This is to send cookies or auth headers with the request
  // };
  //   const issuesRequest = this.http.get<any[]>('http://localhost:3000/issues',{ withCredentials: true }).pipe(
  //     catchError(error => {
  //       console.error('Error fetching issues', error);
  //       return of([]); // Return empty array as a fallback
  //     })
  //   );

  //   // Use forkJoin to handle both requests concurrently
  //   forkJoin([projectsRequest, issuesRequest]).subscribe(results => {
  //     this.projects = results[0];
  //     this.issues = results[1];
  //     console.log('Projects:', this.projects);
  //     console.log('Issues:', this.issues);
  //   });
  }
}
