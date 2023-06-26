import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserexercisesComponent } from './userexercises.component';

describe('UserexercisesComponent', () => {
  let component: UserexercisesComponent;
  let fixture: ComponentFixture<UserexercisesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserexercisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserexercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
