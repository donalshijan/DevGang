import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue.model';
import { Project } from '../../models/project.model'
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-issues-page',
  standalone: true,
  imports: [CommonModule,FormsModule,BsDropdownModule,FontAwesomeModule],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.css'
})
export class IssuesPageComponent implements OnInit {
  chevronDown=faChevronDown;
  issues: Issue[] = [];
  selectedIssue?: Issue;
  projects: Project[] = [];
  filters = { /*project: '',*/ type: '', status: '', /*assignee: ''*/ };
  isOpenType = false;
  isOpenStatus = false;
  constructor(private issueService: IssueService,@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Check if the click is outside the dropdown
    const target = event.target as Element;
    if (!target.closest('.dropdown')) {
      this.isOpenType = false;
      this.isOpenStatus = false;
    }
  }

  toggleDropdown(dropdown: string, event: MouseEvent): void {
    event.stopPropagation();  // Prevents event bubbling
    if (dropdown === 'type') {
      this.isOpenType = !this.isOpenType;
      if (this.isOpenType) {
        this.isOpenStatus = false;  // Close the other dropdown if one opens
      }
    } else if (dropdown === 'status') {
      this.isOpenStatus = !this.isOpenStatus;
      if (this.isOpenStatus) {
        this.isOpenType = false;  // Close the other dropdown if one opens
      }
    }
  }

  types = [
    { name: 'Epic', checked: false },
    { name: 'Bug', checked: false },
    { name: 'Story', checked: false },
    { name: 'Task', checked: false }
  ];

  statuses = [
    { name: 'To Do', checked: false },
    { name: 'In Progress', checked: false },
    { name: 'Done', checked: false }
  ];

  onTypeChange(index: number): void {
    // this.types[index].checked = !this.types[index].checked;
  }

  onStatusChange(index: number): void {
    // this.statuses[index].checked = !this.statuses[index].checked;
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
    this.issueService.getIssues().subscribe({
      next: (issues) => {
        this.issues = issues.issues;
        this.projects = issues.projects;
        this.selectedIssue=issues.issues[0];
      },
      error: (error) => console.error('Error fetching issues:', error)
    });
  }
  }

  selectIssue(issue: Issue): void {
    this.selectedIssue = issue;
  }

  filterIssues(): Issue[] {
    const activeTypes = this.types.filter(t => t.checked).map(t => t.name);
    const activeStatuses = this.statuses.filter(s => s.checked).map(s => s.name);

    return this.issues.filter(issue =>
      (activeTypes.length === 0 || activeTypes.includes(issue.issueType)) &&
      (activeStatuses.length === 0 || activeStatuses.includes(issue.status))
    );
  }
}