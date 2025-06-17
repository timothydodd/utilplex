export interface MonacoConfig {
  theme: string;
  language: string;
  readOnly?: boolean;
  wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  wordWrapColumn?: number;
  wordWrapMinified?: boolean;
  wrappingIndent?: 'none' | 'same' | 'indent' | 'deepIndent';
  wrappingStrategy?: 'simple' | 'advanced';
  automaticLayout?: boolean;
  scrollBeyondLastLine?: boolean;
  minimap?: {
    enabled: boolean;
  };
}
