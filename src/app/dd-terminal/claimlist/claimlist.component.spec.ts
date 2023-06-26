import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimlistComponent } from './claimlist.component';

describe('ClaimlistComponent', () => {
  let component: ClaimlistComponent;
  let fixture: ComponentFixture<ClaimlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
