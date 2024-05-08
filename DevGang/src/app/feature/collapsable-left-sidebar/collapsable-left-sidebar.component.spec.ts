import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsableLeftSidebarComponent } from './collapsable-left-sidebar.component';

describe('CollapsableLeftSidebarComponent', () => {
  let component: CollapsableLeftSidebarComponent;
  let fixture: ComponentFixture<CollapsableLeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollapsableLeftSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollapsableLeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
