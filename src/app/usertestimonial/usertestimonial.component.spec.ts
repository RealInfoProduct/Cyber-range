import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsertestimonialComponent } from './usertestimonial.component';

describe('UsertestimonialComponent', () => {
  let component: UsertestimonialComponent;
  let fixture: ComponentFixture<UsertestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsertestimonialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
