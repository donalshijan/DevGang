import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { Issue } from '../../models/createIssue.model';
import { UserServiceService } from '../../user-service.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ProjectResponse } from '../../models/common.model';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { AppState, selectCurrentProjectId } from '../../project.selectors';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-create-issue-modal',
  standalone: true,
  imports: [MatButtonModule,MatFormFieldModule,MatInputModule,ReactiveFormsModule,MatDialogModule,MatSelectModule],
  templateUrl: './create-issue-modal.component.html',
  styleUrl: './create-issue-modal.component.css'
})
export class CreateIssueModalComponent {
  private baseUrl = environment.baseUrl
  issueForm: FormGroup;
  private projectIdSubscription!: Subscription;

  constructor(private fb: FormBuilder,private http: HttpClient,private userService:UserServiceService,@Inject(PLATFORM_ID) private platformId: Object,private store: Store<AppState>){

    this.issueForm = this.fb.group({
      summary: ['', Validators.required], // The summary field is required.
      description: [''], // The description field is optional.
      issueType: ['Task',Validators.required],
      status: ['To Do',Validators.required],
      projectId: ['',Validators.required]
      });
  }

  ngOnInit(){
    this.setProjectId()
    this.projectIdSubscription = this.store.select(selectCurrentProjectId).subscribe(projectId => {
      this.setProjectId()
    });
}

  setProjectId(){

    let username=this.userService.getUsername()
    let currentProjectId = sessionStorage.getItem('currentProjectId') as string;
    if(currentProjectId==null||currentProjectId==''){
    }
    else{
      this.issueForm.setControl('projectId', this.fb.control(currentProjectId, Validators.required));
    }

  }

  onSaveClick(): void {
    let username=this.userService.getUsername()
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
        if((username==null || username =='') && storedUsername!=null){
          username=storedUsername;
        }
    }
      if (this.issueForm.valid) {
        const issueData = {
          summary: this.issueForm.value.summary,
          issueType: this.issueForm.value.issueType,
          status: this.issueForm.value.status,
          projectId: this.issueForm.value.projectId, // Ensure this field is being populated correctly
        };
        this.http.post(`${this.baseUrl}/create-issue`, { issueData: issueData, username: username }, { withCredentials: true })
        .pipe(
          tap(issueResponse => console.log('Issue created:', issueResponse)),
          catchError(error => {
            console.error('Error creating issue', error);
            return of({}); // Return empty object as a fallback
          })
        ).subscribe(); 
      }
    }

}

