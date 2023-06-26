import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuserprofileComponent } from './viewuserprofile.component';

describe('ViewuserprofileComponent', () => {
  let component: ViewuserprofileComponent;
  let fixture: ComponentFixture<ViewuserprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewuserprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewuserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
