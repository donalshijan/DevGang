import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidableRightSidebarComponent } from './slidable-right-sidebar.component';

describe('SlidableRightSidebarComponent', () => {
  let component: SlidableRightSidebarComponent;
  let fixture: ComponentFixture<SlidableRightSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidableRightSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidableRightSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
