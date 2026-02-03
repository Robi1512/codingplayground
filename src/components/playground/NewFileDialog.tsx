import { useState } from 'react';
import { FileType } from '@/types/playground';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, FileCode, FileText, Braces } from 'lucide-react';

interface NewFileDialogProps {
  onCreateFile: (name: string, content: string, type: FileType) => void;
}

export const NewFileDialog = ({ onCreateFile }: NewFileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedType, setSelectedType] = useState<FileType>('html');

  const handleCreate = () => {
    if (!fileName.trim()) return;
    
    const extension = selectedType === 'html' ? '.html' : selectedType === 'css' ? '.css' : '.js';
    const finalName = fileName.includes('.') ? fileName : `${fileName}${extension}`;
    
    const defaultContent = selectedType === 'html' 
      ? '<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="UTF-8">\n  <title>Meine Seite</title>\n</head>\n<body>\n  <h1>Hallo Welt!</h1>\n</body>\n</html>'
      : selectedType === 'css'
      ? '/* Dein CSS hier */\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}'
      : '// Dein JavaScript hier\nconsole.log("Hallo Welt!");';
    
    onCreateFile(finalName, defaultContent, selectedType);
    setFileName('');
    setOpen(false);
  };

  const typeButtons: { type: FileType; icon: React.ReactNode; label: string }[] = [
    { type: 'html', icon: <FileCode className="w-5 h-5" />, label: 'HTML' },
    { type: 'css', icon: <FileText className="w-5 h-5" />, label: 'CSS' },
    { type: 'js', icon: <Braces className="w-5 h-5" />, label: 'JS' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Neue Datei</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neue Datei erstellen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex gap-2">
            {typeButtons.map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  selectedType === type
                    ? type === 'html' 
                      ? 'border-[hsl(var(--file-html))] bg-[hsl(var(--file-html)/0.1)]'
                      : type === 'css'
                      ? 'border-[hsl(var(--file-css))] bg-[hsl(var(--file-css)/0.1)]'
                      : 'border-[hsl(var(--file-js))] bg-[hsl(var(--file-js)/0.1)]'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className={
                  type === 'html' ? 'icon-html' 
                  : type === 'css' ? 'icon-css' 
                  : 'icon-js'
                }>
                  {icon}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          
          <Input
            placeholder="Dateiname (z.B. index)"
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
