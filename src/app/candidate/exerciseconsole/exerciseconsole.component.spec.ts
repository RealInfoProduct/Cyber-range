import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseconsoleComponent } from './exerciseconsole.component';

describe('ExerciseconsoleComponent', () => {
  let component: ExerciseconsoleComponent;
  let fixture: ComponentFixture<ExerciseconsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseconsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseconsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
