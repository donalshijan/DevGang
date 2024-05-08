import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { UserServiceService } from '../../user-service.service';
import { isPlatformBrowser } from '@angular/common';
import { catchError, finalize, Observable, of, Subscription } from 'rxjs';
import { ProjectResponse } from './types';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { setCurrentProjectId, clearCurrentProjectId } from '../../project.actions';
import { selectCurrentProjectId } from '../../project.selectors';
import { AppState } from '../../project.selectors'; 
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MatButtonModule,MatMenuModule,CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  private baseUrl = environment.baseUrl
  projects: ProjectResponse = {projects:[]};
  currentProjectId$!: Observable<string>;
  currentProjectId! : string;
  private projectIdSubscription!: Subscription;
  constructor(private http: HttpClient,private userService:UserServiceService,@Inject(PLATFORM_ID) private platformId: Object,private store: Store<AppState>,private cdr: ChangeDetectorRef) {
    this.currentProjectId$ = this.store.select(selectCurrentProjectId);
    this.projectIdSubscription = this.store.select(selectCurrentProjectId).subscribe(projectId => {
      if (isPlatformBrowser(this.platformId)) {
        if(projectId!=null&&projectId!=''&&projectId!=sessionStorage.getItem('currentProjectId')){
          this.currentProjectId=projectId;
          sessionStorage.setItem('currentProjectId',projectId);
          this.cdr.detectChanges(); 
        }
        else if(sessionStorage.getItem('currentProjectId')!=null&&sessionStorage.getItem('currentProjectId')!=''){
          this.currentProjectId=sessionStorage.getItem('currentProjectId')as string;
        }
        else{
          console.log('wait for ngOninit to run')
        }
      }
    });
  }

  setProjectId(id: string) {
    this.store.dispatch(setCurrentProjectId({ id }));
    this.cdr.detectChanges();
  }

  clearProjectId() {
    this.store.dispatch(clearCurrentProjectId());
  }

  ngOnInit(){
    let username=this.userService.getUsername()
    if(this.currentProjectId==null||this.currentProjectId==''){
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
          finalize(() => {
            this.cdr.detectChanges();  // Ensure UI updates after data changes
          }),
          catchError(error => {
              console.error('Error fetching projects', error);
              return of({ projects: [] }); // Return empty array as a fallback
          })
        ).subscribe((response:ProjectResponse) => {
          this.projects = response; // Save issues data once fetched
          this.setProjectId(this.projects.projects[0]._id)
          this.userService.setCurrentProjectId(this.projects.projects[0]._id)
          sessionStorage.setItem('currentProjectId', this.userService.getCurrentProjectId());
      });
    }
    }
    else{
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
            })
          ).subscribe((response:ProjectResponse) => {
            this.projects = response; // Save issues data once fetched
        });
      }
      
    }
}
ngOnDestroy() {
  this.projectIdSubscription.unsubscribe();  // It's important to unsubscribe to prevent memory leaks
}
}
