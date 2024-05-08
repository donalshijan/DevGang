import { Directive,ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appYourWorkSubmenuDynamicHost]',
  standalone: true
})
export class YourWorkSubmenuDynamicHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
