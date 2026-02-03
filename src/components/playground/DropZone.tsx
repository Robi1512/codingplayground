import { useState, useCallback, useRef } from 'react';
import { Upload, FolderOpen, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  onFilesDropped: (files: FileList | File[]) => void;
}

export const DropZone = ({ onFilesDropped }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFilesDropped(files);
    }
  }, [onFilesDropped]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesDropped(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesDropped]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`drop-zone p-8 ${isDragging ? 'drop-zone-active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".html,.htm,.css,.js,.ts,.json,.svg,.xml,.md"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className={`p-4 rounded-2xl transition-all duration-300 ${
          isDragging 
            ? 'bg-primary/20 scale-110' 
            : 'bg-muted'
        }`}>
          <Upload className={`w-8 h-8 transition-colors ${
            isDragging ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            Dateien hierher ziehen
          </p>
          <p className="text-sm text-muted-foreground">
            oder klicke um Dateien auszuwählen
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-1.5">
          {['HTML', 'CSS', 'JS', 'TS', 'JSON', 'SVG', 'XML', 'MD'].map(ext => (
            <span 
              key={ext}
              className={`px-2 py-0.5 text-xs font-medium rounded-md bg-[hsl(var(--file-${ext.toLowerCase()})/0.15)] text-[hsl(var(--file-${ext.toLowerCase()}))]`}
            >
              .{ext}
            </span>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleBrowseClick}
          className="mt-2 gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Durchsuchen
        </Button>
      </div>
    </div>
  );
};
