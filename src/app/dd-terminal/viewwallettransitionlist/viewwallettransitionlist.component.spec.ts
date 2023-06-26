import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewwallettransitionlistComponent } from './viewwallettransitionlist.component';

describe('ViewwallettransitionlistComponent', () => {
  let component: ViewwallettransitionlistComponent;
  let fixture: ComponentFixture<ViewwallettransitionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewwallettransitionlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewwallettransitionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
