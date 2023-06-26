import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CandidateheaderComponent } from './candidateheader.component';

describe('CandidateheaderComponent', () => {
  let component: CandidateheaderComponent;
  let fixture: ComponentFixture<CandidateheaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
