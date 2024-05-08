import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDashboardPlaceholder]',
  standalone: true
})
export class DashboardPlaceholderDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
