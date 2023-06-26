import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherlistComponent } from './voucherlist.component';

describe('VoucherlistComponent', () => {
  let component: VoucherlistComponent;
  let fixture: ComponentFixture<VoucherlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
