import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FJsonComponent } from './f-json.component';

describe('FJsonComponent', () => {
  let component: FJsonComponent;
  let fixture: ComponentFixture<FJsonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FJsonComponent]
});
    fixture = TestBed.createComponent(FJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
