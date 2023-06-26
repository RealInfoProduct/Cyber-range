import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallettransitionlistComponent } from './wallettransitionlist.component';

describe('WallettransitionlistComponent', () => {
  let component: WallettransitionlistComponent;
  let fixture: ComponentFixture<WallettransitionlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallettransitionlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallettransitionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
