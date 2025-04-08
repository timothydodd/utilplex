import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatViewComponent } from './format-view.component';

describe('FormatViewComponent', () => {
  let component: FormatViewComponent;
  let fixture: ComponentFixture<FormatViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FormatViewComponent]
});
    fixture = TestBed.createComponent(FormatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
