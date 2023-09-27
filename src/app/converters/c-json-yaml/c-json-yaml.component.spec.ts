import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CJsonYamlComponent } from './c-json-yaml.component';

describe('CJsonYamlComponent', () => {
  let component: CJsonYamlComponent;
  let fixture: ComponentFixture<CJsonYamlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CJsonYamlComponent]
    });
    fixture = TestBed.createComponent(CJsonYamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
