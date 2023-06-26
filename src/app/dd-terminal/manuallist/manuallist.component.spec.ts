import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuallistComponent } from './manuallist.component';

describe('ManuallistComponent', () => {
  let component: ManuallistComponent;
  let fixture: ComponentFixture<ManuallistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManuallistComponent ]
    })
    .compileComponents(); 
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuallistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
