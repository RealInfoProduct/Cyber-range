import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcercisecomComponent } from './excercisecom.component';

describe('ExcercisecomComponent', () => {
  let component: ExcercisecomComponent;
  let fixture: ComponentFixture<ExcercisecomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcercisecomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcercisecomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
