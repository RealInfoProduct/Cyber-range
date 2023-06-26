import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExercisedescriptionComponent } from './exercisedescription.component';

describe('ExercisedescriptionComponent', () => {
  let component: ExercisedescriptionComponent;
  let fixture: ComponentFixture<ExercisedescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercisedescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercisedescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
