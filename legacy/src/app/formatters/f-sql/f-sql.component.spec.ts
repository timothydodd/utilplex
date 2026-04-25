import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FSqlComponent } from './f-sql.component';

describe('FSqlComponent', () => {
  let component: FSqlComponent;
  let fixture: ComponentFixture<FSqlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FSqlComponent]
});
    fixture = TestBed.createComponent(FSqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
