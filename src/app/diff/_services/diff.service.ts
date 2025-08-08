import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DiffResult {
  original: DiffLine[];
  modified: DiffLine[];
}

export interface DiffLine {
  content: string;
  type: 'unchanged' | 'added' | 'removed';
  lineNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiffService {
  
  compare(original: string, modified: string): Observable<DiffResult> {
    try {
      const originalLines = original.split('\n');
      const modifiedLines = modified.split('\n');
      
      const result = this.calculateDiff(originalLines, modifiedLines);
      return of(result);
    } catch (error) {
      throw error;
    }
  }

  private calculateDiff(original: string[], modified: string[]): DiffResult {
    const originalResult: DiffLine[] = [];
    const modifiedResult: DiffLine[] = [];
    
    // Simple line-by-line comparison using longest common subsequence approach
    const lcs = this.longestCommonSubsequence(original, modified);
    
    let i = 0, j = 0, lcsIndex = 0;
    let originalLineNum = 1, modifiedLineNum = 1;
    
    while (i < original.length || j < modified.length) {
      if (lcsIndex < lcs.length && i < original.length && j < modified.length && 
          original[i] === lcs[lcsIndex] && modified[j] === lcs[lcsIndex]) {
        // Lines are the same
        originalResult.push({
          content: original[i],
          type: 'unchanged',
          lineNumber: originalLineNum++
        });
        modifiedResult.push({
          content: modified[j],
          type: 'unchanged',
          lineNumber: modifiedLineNum++
        });
        i++;
        j++;
        lcsIndex++;
      } else if (j < modified.length && (i >= original.length || 
                (lcsIndex < lcs.length && modified[j] !== lcs[lcsIndex] && 
                 (i >= original.length || original[i] === lcs[lcsIndex])))) {
        // Line added in modified
        modifiedResult.push({
          content: modified[j],
          type: 'added',
          lineNumber: modifiedLineNum++
        });
        j++;
      } else {
        // Line removed from original
        originalResult.push({
          content: original[i],
          type: 'removed',
          lineNumber: originalLineNum++
        });
        i++;
      }
    }
    
    return { original: originalResult, modified: modifiedResult };
  }

  private longestCommonSubsequence(a: string[], b: string[]): string[] {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    
    // Build LCS table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    // Reconstruct LCS
    const lcs: string[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        lcs.unshift(a[i - 1]);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
    
    return lcs;
  }
}