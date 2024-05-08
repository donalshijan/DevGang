import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'; // Import if using icons
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { YourWorkComponent } from '../../menu/your-work/your-work.component';
import { ProjectsComponent } from '../../menu/projects/projects.component';
import { TooltipDirective } from '../../tooltip.directive';
import { MatDialog } from '@angular/material/dialog';
import { CreateIssueModalComponent } from '../../feature/create-issue-modal/create-issue-modal.component';
import { AuthService } from '../auth.service';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, CommonModule, RouterModule,FontAwesomeModule,YourWorkComponent,ProjectsComponent,TooltipDirective], // Include MatIconModule if using icons
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  chevronDown=faChevronDown;
  constructor(public dialog: MatDialog,private router: Router,private authService: AuthService,private mainLayout: MainLayoutComponent) {}

  openDialog() {
    const dialogRef = this.dialog.open(CreateIssueModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  filterMenu = [
    { name: 'My Open Issues', link: '/issues/open' },
    { name: 'Reported by Me', link: '/issues/reported' }
  ];

  teamMenu = [
    { name: 'My Team', link: '/team' },
    { name: 'Team Calendar', link: '/calendar' }
  ];

  appMenu = [
    { name: 'Integrations', link: '/integrations' },
    { name: 'Marketplace', link: '/marketplace' }
  ];

  userMenu = [
    // { name: 'Profile', link: '/profile' },
    // { name: 'Settings', link: '/settings' },
    { name: 'Logout', action: () => this.logout() }
  ];

  logout() {
    console.log('Logout action');
    this.authService.logout()
    localStorage.removeItem('isLoggedIn');
    this.mainLayout.notLoggedIn()
    this.router.navigate(['/login']); // Example redirect after logout
  }
}
