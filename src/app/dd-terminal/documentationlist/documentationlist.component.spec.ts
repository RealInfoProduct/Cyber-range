import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentationlistComponent } from './documentationlist.component';

describe('DocumentationlistComponent', () => {
  let component: DocumentationlistComponent;
  let fixture: ComponentFixture<DocumentationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentationlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
