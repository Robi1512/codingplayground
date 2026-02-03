import { FileType } from '@/types/playground';
import { FileCode, FileText, Braces, FileJson, Image, Code, FileType2 } from 'lucide-react';

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
    case 'ts':
      return <Code className={`${baseClass} icon-ts`} />;
    case 'json':
      return <FileJson className={`${baseClass} icon-json`} />;
    case 'svg':
      return <Image className={`${baseClass} icon-svg`} />;
    case 'xml':
      return <FileCode className={`${baseClass} icon-xml`} />;
    case 'md':
      return <FileType2 className={`${baseClass} icon-md`} />;
    default:
      return <FileText className={baseClass} />;
  }
};
