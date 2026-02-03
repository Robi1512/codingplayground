import { PlaygroundFile } from '@/types/playground';
import { FileIcon } from './FileIcon';
import { X } from 'lucide-react';

interface FileTabsProps {
  files: PlaygroundFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export const FileTabs = ({ 
  files, 
  activeFileId, 
  onSelectFile, 
  onDeleteFile 
}: FileTabsProps) => {
  if (files.length === 0) return null;

  const getTabClass = (file: PlaygroundFile, isActive: boolean) => {
    const baseClass = 'file-tab';
    const typeClass = `file-tab-${file.type}`;
    const activeClass = isActive 
      ? 'bg-card text-foreground shadow-sm' 
      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground';
    
    return `${baseClass} ${isActive ? typeClass : ''} ${activeClass}`;
  };

  return (
    <div className="flex items-end gap-1 overflow-x-auto scrollbar-thin pb-0 px-2">
      {files.map(file => {
        const isActive = file.id === activeFileId;
        return (
          <div
            key={file.id}
            className={getTabClass(file, isActive)}
            onClick={() => onSelectFile(file.id)}
          >
            <FileIcon type={file.type} />
            <span className="truncate max-w-[120px]">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              className="p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors ml-1"
              title="Datei löschen"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
