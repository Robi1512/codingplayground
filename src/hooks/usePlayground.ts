import { useState, useCallback } from 'react';
import { PlaygroundFile, FileType } from '@/types/playground';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getFileType = (filename: string): FileType | null => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'html' || ext === 'htm') return 'html';
  if (ext === 'css') return 'css';
  if (ext === 'js' || ext === 'javascript') return 'js';
  return null;
};

export const usePlayground = () => {
  const [files, setFiles] = useState<PlaygroundFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const addFile = useCallback((name: string, content: string, type: FileType) => {
    const newFile: PlaygroundFile = {
      id: generateId(),
      name,
      type,
      content,
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    return newFile;
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, content } : file
      )
    );
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== id);
      if (activeFileId === id) {
        setActiveFileId(newFiles.length > 0 ? newFiles[0].id : null);
      }
      return newFiles;
    });
  }, [activeFileId]);

  const handleFileUpload = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    
    for (const file of filesArray) {
      const type = getFileType(file.name);
      if (!type) continue;
      
      const content = await file.text();
      addFile(file.name, content, type);
    }
  }, [addFile]);

  const activeFile = files.find(f => f.id === activeFileId) || null;

  const getPreviewHtml = useCallback(() => {
    const htmlFiles = files.filter(f => f.type === 'html');
    const cssFiles = files.filter(f => f.type === 'css');
    const jsFiles = files.filter(f => f.type === 'js');

    const htmlContent = htmlFiles.map(f => f.content).join('\n');
    const cssContent = cssFiles.map(f => f.content).join('\n');
    const jsContent = jsFiles.map(f => f.content).join('\n');

    // Check if HTML has a complete structure
    const hasHtmlTag = /<html/i.test(htmlContent);
    const hasHead = /<head/i.test(htmlContent);
    const hasBody = /<body/i.test(htmlContent);

    if (hasHtmlTag && hasHead && hasBody) {
      // Inject CSS and JS into existing structure
      let result = htmlContent;
      
      if (cssContent) {
        const styleTag = `<style>\n${cssContent}\n</style>`;
        result = result.replace(/<\/head>/i, `${styleTag}\n</head>`);
      }
      
      if (jsContent) {
        const scriptTag = `<script>\n${jsContent}\n</script>`;
        result = result.replace(/<\/body>/i, `${scriptTag}\n</body>`);
      }
      
      return result;
    }

    // Build complete HTML document
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent}
  <script>
${jsContent}
  </script>
</body>
</html>`;
  }, [files]);

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    addFile,
    updateFileContent,
    deleteFile,
    handleFileUpload,
    getPreviewHtml,
  };
};
