import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourcelistComponent } from './resourcelist.component';

describe('ResourcelistComponent', () => {
  let component: ResourcelistComponent;
  let fixture: ComponentFixture<ResourcelistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
