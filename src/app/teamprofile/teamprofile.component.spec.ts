import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamprofileComponent } from './teamprofile.component';

describe('TeamprofileComponent', () => {
  let component: TeamprofileComponent;
  let fixture: ComponentFixture<TeamprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
