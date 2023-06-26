import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamtypelistComponent } from './teamtypelist.component';

describe('TeamtypelistComponent', () => {
  let component: TeamtypelistComponent;
  let fixture: ComponentFixture<TeamtypelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamtypelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamtypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
