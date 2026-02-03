import { useState, useCallback } from 'react';
import { PlaygroundFile, FileType, Project } from '@/types/playground';

const generateId = () => Math.random().toString(36).substring(2, 9);

const getFileType = (filename: string): FileType | null => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'html':
    case 'htm':
      return 'html';
    case 'css':
      return 'css';
    case 'js':
    case 'javascript':
      return 'js';
    case 'ts':
    case 'typescript':
      return 'ts';
    case 'json':
      return 'json';
    case 'svg':
      return 'svg';
    case 'xml':
      return 'xml';
    case 'md':
    case 'markdown':
      return 'md';
    default:
      return null;
  }
};

const createDefaultProject = (name: string = 'Projekt 1'): Project => ({
  id: generateId(),
  name,
  files: [],
  activeFileId: null,
  createdAt: Date.now(),
});

export const usePlayground = () => {
  const [projects, setProjects] = useState<Project[]>([createDefaultProject()]);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeFile = activeProject?.files.find(f => f.id === activeProject.activeFileId) || null;

  // Project management
  const addProject = useCallback((name?: string) => {
    const projectNumber = projects.length + 1;
    const newProject = createDefaultProject(name || `Projekt ${projectNumber}`);
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    return newProject;
  }, [projects.length]);

  const renameProject = useCallback((projectId: string, newName: string) => {
    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, name: newName } : p)
    );
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => {
      const newProjects = prev.filter(p => p.id !== projectId);
      if (newProjects.length === 0) {
        const newProject = createDefaultProject();
        setActiveProjectId(newProject.id);
        return [newProject];
      }
      if (activeProjectId === projectId) {
        setActiveProjectId(newProjects[0].id);
      }
      return newProjects;
    });
  }, [activeProjectId]);

  const duplicateProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const newProject: Project = {
      ...project,
      id: generateId(),
      name: `${project.name} (Kopie)`,
      files: project.files.map(f => ({ ...f, id: generateId() })),
      createdAt: Date.now(),
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  }, [projects]);

  // File management within active project
  const addFile = useCallback((name: string, content: string, type: FileType) => {
    const newFile: PlaygroundFile = {
      id: generateId(),
      name,
      type,
      content,
    };
    
    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId
          ? { ...p, files: [...p.files, newFile], activeFileId: newFile.id }
          : p
      )
    );
    return newFile;
  }, [activeProjectId]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId
          ? {
              ...p,
              files: p.files.map(f =>
                f.id === fileId ? { ...f, content } : f
              ),
            }
          : p
      )
    );
  }, [activeProjectId]);

  const deleteFile = useCallback((fileId: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== activeProjectId) return p;
        const newFiles = p.files.filter(f => f.id !== fileId);
        return {
          ...p,
          files: newFiles,
          activeFileId: p.activeFileId === fileId
            ? (newFiles.length > 0 ? newFiles[0].id : null)
            : p.activeFileId,
        };
      })
    );
  }, [activeProjectId]);

  const setActiveFileId = useCallback((fileId: string | null) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId ? { ...p, activeFileId: fileId } : p
      )
    );
  }, [activeProjectId]);

  const handleFileUpload = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    
    for (const file of filesArray) {
      const type = getFileType(file.name);
      if (!type) continue;
      
      const content = await file.text();
      addFile(file.name, content, type);
    }
  }, [addFile]);

  const clearAllFiles = useCallback(() => {
    setProjects(prev =>
      prev.map(p =>
        p.id === activeProjectId
          ? { ...p, files: [], activeFileId: null }
          : p
      )
    );
  }, [activeProjectId]);

  const getPreviewHtml = useCallback(() => {
    const files = activeProject?.files || [];
    const htmlFiles = files.filter(f => f.type === 'html');
    const cssFiles = files.filter(f => f.type === 'css');
    const jsFiles = files.filter(f => f.type === 'js');
    const tsFiles = files.filter(f => f.type === 'ts');
    const svgFiles = files.filter(f => f.type === 'svg');
    const jsonFiles = files.filter(f => f.type === 'json');

    const htmlContent = htmlFiles.map(f => f.content).join('\n');
    const cssContent = cssFiles.map(f => f.content).join('\n');
    // TypeScript is treated as JavaScript for preview (browser can handle basic TS)
    const jsContent = [...jsFiles, ...tsFiles].map(f => f.content).join('\n');
    const svgContent = svgFiles.map(f => f.content).join('\n');
    
    // Make JSON available as global variables
    const jsonVars = jsonFiles.map(f => {
      const varName = f.name.replace(/\.json$/, '').replace(/[^a-zA-Z0-9_]/g, '_');
      try {
        return `window.${varName} = ${f.content};`;
      } catch {
        return '';
      }
    }).join('\n');

    const hasHtmlTag = /<html/i.test(htmlContent);
    const hasHead = /<head/i.test(htmlContent);
    const hasBody = /<body/i.test(htmlContent);

    if (hasHtmlTag && hasHead && hasBody) {
      let result = htmlContent;
      
      if (cssContent) {
        result = result.replace(/<\/head>/i, `<style>\n${cssContent}\n</style>\n</head>`);
      }
      
      if (svgContent) {
        result = result.replace(/<body([^>]*)>/i, `<body$1>\n${svgContent}\n`);
      }
      
      if (jsonVars || jsContent) {
        result = result.replace(/<\/body>/i, `<script>\n${jsonVars}\n${jsContent}\n</script>\n</body>`);
      }
      
      return result;
    }

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
${svgContent}
${htmlContent}
  <script>
${jsonVars}
${jsContent}
  </script>
</body>
</html>`;
  }, [activeProject?.files]);

  return {
    // Projects
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    addProject,
    renameProject,
    deleteProject,
    duplicateProject,
    // Files
    files: activeProject?.files || [],
    activeFile,
    activeFileId: activeProject?.activeFileId || null,
    setActiveFileId,
    addFile,
    updateFileContent,
    deleteFile,
    handleFileUpload,
    clearAllFiles,
    getPreviewHtml,
  };
};
