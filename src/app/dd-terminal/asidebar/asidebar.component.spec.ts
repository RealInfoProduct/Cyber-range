import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsidebarComponent } from './asidebar.component';

describe('AsidebarComponent', () => {
  let component: AsidebarComponent;
  let fixture: ComponentFixture<AsidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
