import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleslistComponent } from './roleslist.component';

describe('RoleslistComponent', () => {
  let component: RoleslistComponent;
  let fixture: ComponentFixture<RoleslistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
