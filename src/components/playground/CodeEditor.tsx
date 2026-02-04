import { useEffect, useRef, useCallback } from 'react';
import { PlaygroundFile } from '@/types/playground';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-ini';

interface CodeEditorProps {
  file: PlaygroundFile | null;
  onContentChange: (id: string, content: string) => void;
}

const getLanguage = (type: string): string => {
  switch (type) {
    case 'html':
    case 'xml':
    case 'svg':
      return 'markup';
    case 'css':
      return 'css';
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'jsx':
      return 'jsx';
    case 'tsx':
      return 'tsx';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'yaml':
      return 'yaml';
    case 'sql':
      return 'sql';
    case 'ini':
      return 'ini';
    default:
      return 'plaintext';
  }
};

export const CodeEditor = ({ file, onContentChange }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateHighlight = useCallback(() => {
    if (!file || !highlightRef.current) return;
    
    const language = getLanguage(file.type);
    let highlighted: string;
    
    if (Prism.languages[language]) {
      highlighted = Prism.highlight(file.content || '', Prism.languages[language], language);
    } else {
      highlighted = file.content || '';
    }
    
    highlightRef.current.innerHTML = highlighted + '\n';
  }, [file]);

  useEffect(() => {
    updateHighlight();
  }, [updateHighlight, file?.content, file?.type]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      if (file) {
        onContentChange(file.id, newValue);
        // Set cursor position after React updates
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    }
  }, [file, onContentChange]);

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
    <div ref={containerRef} className="code-editor-container">
      <pre
        ref={highlightRef}
        className="code-highlight scrollbar-thin"
        aria-hidden="true"
      />
      <textarea
        ref={textareaRef}
        className="code-textarea scrollbar-thin"
        value={file.content}
        onChange={(e) => onContentChange(file.id, e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder={`Schreibe deinen ${file.type.toUpperCase()} Code hier...`}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
};
