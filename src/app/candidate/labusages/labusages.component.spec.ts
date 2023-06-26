import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabusagesComponent } from './labusages.component';

describe('LabusagesComponent', () => {
  let component: LabusagesComponent;
  let fixture: ComponentFixture<LabusagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabusagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabusagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
