import { AfterViewInit, Component, ComponentFactoryResolver, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { DashboardPlaceholderDirective } from './dashboard-placeholder.directive';
import { Subscription } from 'rxjs';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { KanbanComponent } from '../kanban/kanban.component';
import { IssuesPageComponent } from '../issues-page/issues-page.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,KanbanComponent,IssuesPageComponent,DashboardPlaceholderDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  // Correct the property name to `styleUrls`
})
export class DashboardComponent implements AfterViewInit{
  @ViewChild(DashboardPlaceholderDirective, { static: true }) appPlaceholder!: DashboardPlaceholderDirective;
  private componentLoadSubscription!: Subscription;
  constructor(private componentLoaderService: ComponentLoaderService,private componentFactoryResolver: ComponentFactoryResolver,@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.loadComponent(KanbanComponent);
      }
    }); 
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.componentLoadSubscription = this.componentLoaderService.loadComponent$.subscribe(component => {
          this.loadComponent(component);
        });
      }
    }); 
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
    this.componentLoadSubscription.unsubscribe();
    }
  }
  loadComponent(component: any) {
    const viewContainerRef = this.appPlaceholder.viewContainerRef;
    viewContainerRef.clear();
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    viewContainerRef.createComponent(componentFactory);
  }
}