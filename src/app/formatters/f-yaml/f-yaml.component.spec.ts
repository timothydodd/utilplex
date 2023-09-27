import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FYamlComponent } from './f-yaml.component';

describe('FYamlComponent', () => {
  let component: FYamlComponent;
  let fixture: ComponentFixture<FYamlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FYamlComponent]
    });
    fixture = TestBed.createComponent(FYamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
