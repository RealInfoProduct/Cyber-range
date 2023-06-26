import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MitreComponent } from './mitre.component';

describe('MitreComponent', () => {
  let component: MitreComponent;
  let fixture: ComponentFixture<MitreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MitreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MitreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
