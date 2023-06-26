import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamtypeComponent } from './teamtype.component';

describe('TeamtypeComponent', () => {
  let component: TeamtypeComponent;
  let fixture: ComponentFixture<TeamtypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamtypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
