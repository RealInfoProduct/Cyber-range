import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExerciselistComponent } from './exerciselist.component';

describe('ExerciselistComponent', () => {
  let component: ExerciselistComponent;
  let fixture: ComponentFixture<ExerciselistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
