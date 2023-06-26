import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CandidatefooterComponent } from './candidatefooter.component';

describe('CandidatefooterComponent', () => {
  let component: CandidatefooterComponent;
  let fixture: ComponentFixture<CandidatefooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatefooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatefooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
