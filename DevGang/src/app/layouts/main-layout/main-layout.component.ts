import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../core/header/header.component';
import {FooterComponent} from '../../core/footer/footer.component'
import { NavigationComponent } from '../../core/navigation/navigation.component';
import { LoadingSpinnerComponent } from '../../core/loading-spinner/loading-spinner.component';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common'; 
import { CollapsableLeftSidebarComponent } from '../../feature/collapsable-left-sidebar/collapsable-left-sidebar.component';
import { NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule,HeaderComponent,FooterComponent,NavigationComponent,LoadingSpinnerComponent,CommonModule,CollapsableLeftSidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef,private zone: NgZone,@Inject(PLATFORM_ID) private platformId: Object) {
  }
  public updateLoginStatus(status:boolean):void{
    this.isLoggedIn=status;
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }
  }
  notLoggedIn(){
    this.isLoggedIn=false;
  }
  loginChecked(){
    this.authService.isLoggedIn().subscribe(status => {
      this.zone.run(() => { // Use Angular's zone to handle updates
        this.isLoggedIn = status;
        console.log('Updated isLoggedn within zone:', this.isLoggedIn);
      });
      console.log('status',status)
      this.isLoggedIn = status;
      localStorage.setItem('isLoggedIn', this.isLoggedIn.toString());
      this.cdr.detectChanges();
      console.log(this.isLoggedIn)
    });
  }

}
