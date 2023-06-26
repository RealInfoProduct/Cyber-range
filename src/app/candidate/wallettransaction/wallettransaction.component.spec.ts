import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallettransactionComponent } from './wallettransaction.component';

describe('WallettransactionComponent', () => {
  let component: WallettransactionComponent;
  let fixture: ComponentFixture<WallettransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallettransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallettransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
