import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpurchasevoucherlistComponent } from './viewpurchasevoucherlist.component';

describe('ViewpurchasevoucherlistComponent', () => {
  let component: ViewpurchasevoucherlistComponent;
  let fixture: ComponentFixture<ViewpurchasevoucherlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewpurchasevoucherlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpurchasevoucherlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
