import { PlaygroundFile } from '@/types/playground';

interface CodeEditorProps {
  file: PlaygroundFile | null;
  onContentChange: (id: string, content: string) => void;
}

export const CodeEditor = ({ file, onContentChange }: CodeEditorProps) => {
  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-[hsl(var(--editor-bg))] text-muted-foreground">
        <p className="text-center p-4">
          Wähle eine Datei aus oder lade eine neue hoch
        </p>
      </div>
    );
  }

  return (
    <textarea
      className="editor-textarea scrollbar-thin"
      value={file.content}
      onChange={(e) => onContentChange(file.id, e.target.value)}
      placeholder={`Schreibe deinen ${file.type.toUpperCase()} Code hier...`}
      spellCheck={false}
    />
  );
};
