import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewnetworkComponent } from './viewnetwork.component';

describe('ViewnetworkComponent', () => {
  let component: ViewnetworkComponent;
  let fixture: ComponentFixture<ViewnetworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewnetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewnetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
