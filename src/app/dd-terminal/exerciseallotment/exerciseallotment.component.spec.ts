import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseallotmentComponent } from './exerciseallotment.component';

describe('ExerciseallotmentComponent', () => {
  let component: ExerciseallotmentComponent;
  let fixture: ComponentFixture<ExerciseallotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseallotmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
