import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DdTerminalComponent } from './dd-terminal.component';

describe('DdTerminalComponent', () => {
  let component: DdTerminalComponent;
  let fixture: ComponentFixture<DdTerminalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DdTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
