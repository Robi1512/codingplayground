import { useState } from 'react';
import { FileType, FILE_TYPE_INFO } from '@/types/playground';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { FileIcon } from './FileIcon';

interface NewFileDialogProps {
  onCreateFile: (name: string, content: string, type: FileType) => void;
}

const defaultContents: Record<FileType, string> = {
  html: '<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="UTF-8">\n  <title>Meine Seite</title>\n</head>\n<body>\n  <h1>Hallo Welt!</h1>\n</body>\n</html>',
  css: '/* Dein CSS hier */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
  js: '// Dein JavaScript hier\nconsole.log("Hallo Welt!");',
  ts: '// Dein TypeScript hier\nconst greeting: string = "Hallo Welt!";\nconsole.log(greeting);',
  jsx: '// Dein JSX hier\nfunction App() {\n  return <h1>Hallo Welt!</h1>;\n}',
  tsx: '// Dein TSX hier\ninterface Props { name: string; }\nfunction Greeting({ name }: Props) {\n  return <h1>Hallo {name}!</h1>;\n}',
  json: '{\n  "name": "Mein Projekt",\n  "version": "1.0.0"\n}',
  svg: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="#4f46e5" />\n</svg>',
  xml: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item>Inhalt</item>\n</root>',
  md: '# Überschrift\n\nDein Markdown-Text hier...',
  txt: 'Dein Text hier...',
  yaml: '# YAML Konfiguration\nname: mein-projekt\nversion: 1.0.0',
  ini: '; Konfigurationsdatei\n[section]\nkey=value',
  csv: 'name,alter,stadt\nMax,25,Berlin\nAnna,30,Hamburg',
  sql: '-- SQL Abfrage\nSELECT * FROM users WHERE active = true;',
};

const allFileTypes: FileType[] = ['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'json', 'svg', 'xml', 'md', 'txt', 'yaml', 'ini', 'csv', 'sql'];

export const NewFileDialog = ({ onCreateFile }: NewFileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedType, setSelectedType] = useState<FileType>('html');

  const handleCreate = () => {
    if (!fileName.trim()) return;
    
    const info = FILE_TYPE_INFO[selectedType];
    const finalName = fileName.includes('.') ? fileName : `${fileName}${info.extension}`;
    
    onCreateFile(finalName, defaultContents[selectedType], selectedType);
    setFileName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Neue Datei</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Neue Datei erstellen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-5 gap-2">
            {allFileTypes.map(type => {
              const info = FILE_TYPE_INFO[type];
              const isSelected = selectedType === type;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-current bg-current/10'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                  style={isSelected ? { color: `hsl(${info.color})` } : undefined}
                >
                  <FileIcon type={type} className="w-5 h-5" />
                  <span className="text-xs font-medium">{info.label}</span>
                </button>
              );
            })}
          </div>
          
          <Input
            placeholder={`Dateiname (z.B. index${FILE_TYPE_INFO[selectedType].extension})`}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          
          <Button onClick={handleCreate} className="w-full">
            Erstellen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
