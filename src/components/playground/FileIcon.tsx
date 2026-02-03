import { FileType } from '@/types/playground';
import { FileCode, FileText, Braces } from 'lucide-react';

interface FileIconProps {
  type: FileType;
  className?: string;
}

export const FileIcon = ({ type, className = '' }: FileIconProps) => {
  const baseClass = `w-4 h-4 ${className}`;
  
  switch (type) {
    case 'html':
      return <FileCode className={`${baseClass} icon-html`} />;
    case 'css':
      return <FileText className={`${baseClass} icon-css`} />;
    case 'js':
      return <Braces className={`${baseClass} icon-js`} />;
  }
};
