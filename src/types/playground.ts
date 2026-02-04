export type FileType = 'html' | 'css' | 'js' | 'ts' | 'jsx' | 'tsx' | 'json' | 'svg' | 'xml' | 'md' | 'txt' | 'yaml' | 'ini' | 'csv' | 'sql';

export interface PlaygroundFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  files: PlaygroundFile[];
  activeFileId: string | null;
  createdAt: number;
}

export interface PlaygroundState {
  projects: Project[];
  activeProjectId: string | null;
}

export const FILE_TYPE_INFO: Record<FileType, { label: string; extension: string; color: string }> = {
  html: { label: 'HTML', extension: '.html', color: 'var(--file-html)' },
  css: { label: 'CSS', extension: '.css', color: 'var(--file-css)' },
  js: { label: 'JavaScript', extension: '.js', color: 'var(--file-js)' },
  ts: { label: 'TypeScript', extension: '.ts', color: 'var(--file-ts)' },
  jsx: { label: 'JSX', extension: '.jsx', color: 'var(--file-jsx)' },
  tsx: { label: 'TSX', extension: '.tsx', color: 'var(--file-tsx)' },
  json: { label: 'JSON', extension: '.json', color: 'var(--file-json)' },
  svg: { label: 'SVG', extension: '.svg', color: 'var(--file-svg)' },
  xml: { label: 'XML', extension: '.xml', color: 'var(--file-xml)' },
  md: { label: 'Markdown', extension: '.md', color: 'var(--file-md)' },
  txt: { label: 'Text', extension: '.txt', color: 'var(--file-txt)' },
  yaml: { label: 'YAML', extension: '.yaml', color: 'var(--file-yaml)' },
  ini: { label: 'INI', extension: '.ini', color: 'var(--file-ini)' },
  csv: { label: 'CSV', extension: '.csv', color: 'var(--file-csv)' },
  sql: { label: 'SQL', extension: '.sql', color: 'var(--file-sql)' },
};
