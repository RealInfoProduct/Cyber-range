import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExerciserepositoryComponent } from './exerciserepository.component';

describe('ExerciserepositoryComponent', () => {
  let component: ExerciserepositoryComponent;
  let fixture: ComponentFixture<ExerciserepositoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciserepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciserepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
