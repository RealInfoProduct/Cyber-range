import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemorequestlistComponent } from './demorequestlist.component';

describe('DemorequestlistComponent', () => {
  let component: DemorequestlistComponent;
  let fixture: ComponentFixture<DemorequestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemorequestlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemorequestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
