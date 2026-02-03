export type FileType = 'html' | 'css' | 'js' | 'ts' | 'json' | 'svg' | 'xml' | 'md';

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
  json: { label: 'JSON', extension: '.json', color: 'var(--file-json)' },
  svg: { label: 'SVG', extension: '.svg', color: 'var(--file-svg)' },
  xml: { label: 'XML', extension: '.xml', color: 'var(--file-xml)' },
  md: { label: 'Markdown', extension: '.md', color: 'var(--file-md)' },
};
