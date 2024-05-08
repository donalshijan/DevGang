import { AfterViewInit, Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { IssuesPageComponent } from '../issues-page/issues-page.component';
import { KanbanComponent } from '../kanban/kanban.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { isPlatformBrowser } from '@angular/common';
import { UserServiceService } from '../../user-service.service';
import { IssueResponse, ProjectResponse } from './types';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, selectCurrentProjectId } from '../../project.selectors';
import { clearCurrentProjectId, setCurrentProjectId } from '../../project.actions';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-collapsable-left-sidebar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './collapsable-left-sidebar.component.html',
  styleUrl: './collapsable-left-sidebar.component.css'
})
export class CollapsableLeftSidebarComponent implements AfterViewInit{
  private baseUrl =  environment.baseUrl
  isCollapsed = false;
  private isResizing = false;
  private lastX = 0;
  chevronLeft=faChevronLeft;
  projects: ProjectResponse = {projects:[]};
  issues: IssueResponse = {issues:[]};
  currentProjectName: String = '';
  private projectIdSubscription!: Subscription;
  @ViewChild('resizeHandle') resizeHandle!: ElementRef;
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  constructor(private elementRef: ElementRef,private http: HttpClient,private userService:UserServiceService,private componentLoaderService: ComponentLoaderService,@Inject(PLATFORM_ID) private platformId: Object,private store: Store<AppState>) {}
  


  loadIssuesPage() {
    this.componentLoaderService.requestLoadComponent(IssuesPageComponent);
  }
  
  loadKanban(){
    this.componentLoaderService.requestLoadComponent(KanbanComponent);
  }
  loadTimeline(){
    this.componentLoaderService.requestLoadComponent(TimelineComponent);
  }

  setProjectId(id: string) {
    this.store.dispatch(setCurrentProjectId({ id }));
  }

  clearProjectId() {
    this.store.dispatch(clearCurrentProjectId());
  }


  ngOnInit(){
    let username=this.userService.getUsername()
    let currentProjectId = this.userService.getCurrentProjectId()
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
          if(sessionStorage.getItem('currentProjectId')==null||sessionStorage.getItem('currentProjectId')==''){
            sessionStorage.setItem('currentProjectId',this.projects.projects[0]._id)
            this.userService.setCurrentProjectId(this.projects.projects[0]._id)
          }
          this.currentProjectName = this.projects.projects.find(project => project._id=== sessionStorage.getItem('currentProjectId'))?.name as string
          this.setProjectId(sessionStorage.getItem('currentProjectId') as string)
          this.projectIdSubscription = this.store.select(selectCurrentProjectId).subscribe(projectId => {
            this.currentProjectName = this.projects.projects.find(project => project._id === projectId)?.name as string;
          });
      });
    }
}

  ngAfterViewInit() {
    // This ensures that the event listeners are attached directly to the resize handle
    this.resizeHandle.nativeElement.addEventListener('mousedown', this.initResize.bind(this));
  }

  @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
      if (!this.isResizing) return;
      requestAnimationFrame(() => {
        const dx = event.clientX - this.lastX; // Change in horizontal position
        const sidebar = document.querySelector('.sidebar') as HTMLElement;
        if (sidebar) {
            const newWidth = event.clientX;
            if(newWidth<15==false){
              sidebar.style.setProperty('--sidebar-width', `${newWidth}px`);
            this.lastX = event.clientX; // Update lastX to the current X position
            }

        }
    });

    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        if (this.isResizing) {
            this.isResizing = false;
        }
    }

    initResize(event: MouseEvent) {
      if (event.target === this.resizeHandle.nativeElement) {
        this.isResizing = true;
        this.lastX = event.clientX;
        event.preventDefault(); // Prevent selection start (text selection, etc.)
      }  
    }
}
