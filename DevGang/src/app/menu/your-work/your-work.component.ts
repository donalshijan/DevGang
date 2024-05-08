import { AfterViewInit, Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { YourWorkSubmenuDynamicHostDirective } from './your-work-submenu-dynamic-host.directive';
import { AssignedToMeComponent} from './assigned-to-me/assigned-to-me.component';
import { RecentComponent } from './recent/recent.component';
import { BoardsComponent } from './boards/boards.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-your-work',
  standalone: true,
  imports: [AssignedToMeComponent,RecentComponent,BoardsComponent,CommonModule,YourWorkSubmenuDynamicHostDirective],
  templateUrl: './your-work.component.html',
  styleUrl: './your-work.component.css'
})
export class YourWorkComponent implements AfterViewInit {
  @ViewChild(YourWorkSubmenuDynamicHostDirective, { static: true }) yourWorkSubMenuDynamicHost!: YourWorkSubmenuDynamicHostDirective;
  currentType: string = '';
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  loadComponent(type: string) {
    this.currentType = type; 
    const viewContainerRef = this.yourWorkSubMenuDynamicHost.viewContainerRef;
    viewContainerRef.clear();

    let componentFactory;

    switch (type) {
      case 'assigned':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(AssignedToMeComponent);
        break;
      case 'recent':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(RecentComponent);
        break;
      case 'boards':
        componentFactory = this.componentFactoryResolver.resolveComponentFactory(BoardsComponent);
        break;
      default:
        return;
    }

    viewContainerRef.createComponent(componentFactory);
  }
  ngAfterViewInit() {
    setTimeout(() => this.loadComponent('assigned')); 
  }
}
