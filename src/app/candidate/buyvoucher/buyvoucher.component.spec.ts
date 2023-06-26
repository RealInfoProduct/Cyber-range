import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyvoucherComponent } from './buyvoucher.component';

describe('BuyvoucherComponent', () => {
  let component: BuyvoucherComponent;
  let fixture: ComponentFixture<BuyvoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyvoucherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
