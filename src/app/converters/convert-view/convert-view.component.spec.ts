import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertViewComponent } from './convert-view.component';

describe('ConvertViewComponent', () => {
  let component: ConvertViewComponent;
  let fixture: ComponentFixture<ConvertViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ConvertViewComponent]
});
    fixture = TestBed.createComponent(ConvertViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
