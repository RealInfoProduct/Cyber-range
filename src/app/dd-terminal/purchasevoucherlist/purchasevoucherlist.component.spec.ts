import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasevoucherlistComponent } from './purchasevoucherlist.component';

describe('PurchasevoucherlistComponent', () => {
  let component: PurchasevoucherlistComponent;
  let fixture: ComponentFixture<PurchasevoucherlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasevoucherlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasevoucherlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
