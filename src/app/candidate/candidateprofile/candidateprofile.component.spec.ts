import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CandidateprofileComponent } from './candidateprofile.component';

describe('CandidateprofileComponent', () => {
  let component: CandidateprofileComponent;
  let fixture: ComponentFixture<CandidateprofileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
