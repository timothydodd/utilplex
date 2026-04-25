import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiffViewComponent } from './diff-view.component';

describe('DiffViewComponent', () => {
  let component: DiffViewComponent;
  let fixture: ComponentFixture<DiffViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DiffViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle empty input', () => {
    component.originalChanged('');
    component.modifiedChanged('');
    expect(component.diffResult()).toBeNull();
  });

  it('should detect added lines', () => {
    component.originalChanged('line1\nline2');
    component.modifiedChanged('line1\nline2\nline3');
    
    const result = component.diffResult();
    expect(result).toBeTruthy();
    if (result) {
      const addedLines = result.modified.filter(line => line.type === 'added');
      expect(addedLines.length).toBe(1);
      expect(addedLines[0].content).toBe('line3');
    }
  });

  it('should detect removed lines', () => {
    component.originalChanged('line1\nline2\nline3');
    component.modifiedChanged('line1\nline3');
    
    const result = component.diffResult();
    expect(result).toBeTruthy();
    if (result) {
      const removedLines = result.original.filter(line => line.type === 'removed');
      expect(removedLines.length).toBe(1);
      expect(removedLines[0].content).toBe('line2');
    }
  });
});