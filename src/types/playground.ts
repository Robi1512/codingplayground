export type FileType = 'html' | 'css' | 'js';

export interface PlaygroundFile {
  id: string;
  name: string;
  type: FileType;
  content: string;
}

export interface PlaygroundState {
  files: PlaygroundFile[];
  activeFileId: string | null;
}
