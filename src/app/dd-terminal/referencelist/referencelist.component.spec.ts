import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencelistComponent } from './referencelist.component';

describe('ReferencelistComponent', () => {
  let component: ReferencelistComponent;
  let fixture: ComponentFixture<ReferencelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferencelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferencelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
