import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { from } from 'rxjs';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { NGX_MONACO_EDITOR_CONFIG } from 'src/app/components/editor/config';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from 'src/app/monaco/ng-monaco-config';
import { DiffResult, DiffService } from '../_services/diff.service';

@Component({
  selector: 'app-diff-view',
  templateUrl: './diff-view.component.html',
  styleUrls: ['./diff-view.component.scss'],
  imports: [CommonModule, FormsModule, EditorComponent],
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }],
})
export class DiffViewComponent {
  diffService = inject(DiffService);
  
  originalCode = signal<string>('');
  modifiedCode = signal<string>('');
  diffResult = signal<DiffResult | null>(null);
  error = signal<string>('');
  showDiffView = signal<boolean>(false);

  originalOptions: MonacoConfig = {
    theme: 'dracula',
    language: 'text',
    readOnly: false,
  };
  
  modifiedOptions: MonacoConfig = {
    theme: 'dracula',
    language: 'text',
    readOnly: false,
  };

  private meta = inject(Meta);
  private titleService = inject(Title);

  constructor() {
    const data = getRouteData('File Diff');
    if (!data) {
      throw new Error('Route data not found for File Diff');
    }
    this.titleService.setTitle('UtilPlex | ' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    RouteService.Title.set('File Diff Checker');
  }

  originalChanged(txt: string) {
    this.originalCode.set(txt);
    this.performDiff();
  }

  modifiedChanged(txt: string) {
    this.modifiedCode.set(txt);
    this.performDiff();
  }

  private performDiff() {
    this.error.set('');
    if (!this.originalCode() && !this.modifiedCode()) {
      this.diffResult.set(null);
      return;
    }

    try {
      this.diffService.compare(this.originalCode(), this.modifiedCode()).subscribe({
        next: (result) => {
          this.diffResult.set(result);
        },
        error: (err) => {
          this.error.set(err?.message || 'Error comparing files');
        },
      });
    } catch (err: any) {
      this.error.set(err?.message || 'Error comparing files');
    }
  }

  pasteOriginal() {
    from(navigator.clipboard.readText()).subscribe((txt) => this.originalChanged(txt));
  }

  pasteModified() {
    from(navigator.clipboard.readText()).subscribe((txt) => this.modifiedChanged(txt));
  }

  clearOriginal() {
    this.originalChanged('');
  }

  clearModified() {
    this.modifiedChanged('');
  }

  toggleView() {
    this.showDiffView.set(!this.showDiffView());
  }



  getAddedCount(): number {
    const result = this.diffResult();
    return result ? result.modified.filter(line => line.type === 'added').length : 0;
  }

  getRemovedCount(): number {
    const result = this.diffResult();
    return result ? result.original.filter(line => line.type === 'removed').length : 0;
  }

  getUnchangedCount(): number {
    const result = this.diffResult();
    return result ? result.original.filter(line => line.type === 'unchanged').length : 0;
  }
}