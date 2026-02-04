import { useState, useRef } from 'react';
import { PlaygroundFile } from '@/types/playground';
import { FileIcon } from './FileIcon';
import { X, GripVertical } from 'lucide-react';

interface FileTabsProps {
  files: PlaygroundFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
  onReorderFiles: (fromIndex: number, toIndex: number) => void;
}

export const FileTabs = ({ 
  files, 
  activeFileId, 
  onSelectFile, 
  onDeleteFile,
  onReorderFiles,
}: FileTabsProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  if (files.length === 0) return null;

  const getTabClass = (file: PlaygroundFile, isActive: boolean) => {
    const baseClass = 'file-tab';
    const typeClass = `file-tab-${file.type}`;
    const activeClass = isActive 
      ? 'bg-card text-foreground shadow-sm' 
      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground';
    
    return `${baseClass} ${isActive ? typeClass : ''} ${activeClass}`;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Make the drag image slightly transparent
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '0.5';
    }
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onReorderFiles(draggedIndex, toIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex items-end gap-1 overflow-x-auto scrollbar-thin pb-0 px-2">
      {files.map((file, index) => {
        const isActive = file.id === activeFileId;
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index;
        
        return (
          <div
            key={file.id}
            className={`${getTabClass(file, isActive)} ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'ring-2 ring-primary' : ''}`}
            onClick={() => onSelectFile(file.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground cursor-grab opacity-50 hover:opacity-100" />
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
