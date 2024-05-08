import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from '../../user-service.service';
import { map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AppState } from '../../project.selectors';
import { Store } from '@ngrx/store';
import { clearCurrentProjectId, setCurrentProjectId } from '../../project.actions';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [ReactiveFormsModule,MatButtonModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})

export class CreateProjectComponent implements OnInit {
  projectForm!: FormGroup;
  private baseUrl = environment.baseUrl
  constructor(private fb: FormBuilder,private http: HttpClient,private userService:UserServiceService,@Inject(PLATFORM_ID) private platformId: Object,private router: Router,private store: Store<AppState>){}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      description: ['', ]
    });
  }

  setProjectId(id: string) {
    this.store.dispatch(setCurrentProjectId({ id }));
  }

  clearProjectId() {
    this.store.dispatch(clearCurrentProjectId());
  }

  onCreate(): void {
    let username=this.userService.getUsername()
    if (isPlatformBrowser(this.platformId)) {
      const storedUsername = localStorage.getItem('username');
        if((username==null || username =='') && storedUsername!=null){
          username=storedUsername;
        }
    }
    if (this.projectForm.valid) {
      const newProjectData = {name : this.projectForm.value.projectName, description: this.projectForm.value.description, board : { name: "Kanban Board", stages: ["To Do", "In Progress", "Done"]}}

          this.http.post<{message:String,projectId:string}>(`${this.baseUrl}/create-project`, {username: username, projectData:{...newProjectData}}, { withCredentials: true })
            .pipe(
              tap(projectResponse => console.log('Project creation successful:', projectResponse)),
              map(response => {this.userService.setCurrentProjectId(response.projectId);
                return response; // You may want to return the whole response or just a part of it
              })
            ).subscribe(response=>{ this.setProjectId(response.projectId)
              this.router.navigate(['/']);
            });
      // Here you would typically handle the form submission, e.g., send to backend
    } else {
      console.error('Form is not valid!');
    }
  }
}
