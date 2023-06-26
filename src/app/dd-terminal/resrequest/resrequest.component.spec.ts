import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResrequestComponent } from './resrequest.component';

describe('ResrequestComponent', () => {
  let component: ResrequestComponent;
  let fixture: ComponentFixture<ResrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResrequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
