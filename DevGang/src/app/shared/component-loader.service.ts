import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentLoaderService {
  private loadComponentSource = new Subject<any>();
  loadComponent$ = this.loadComponentSource.asObservable();

  constructor() { }

  requestLoadComponent(component: any) {
    this.loadComponentSource.next(component);
  }
}
