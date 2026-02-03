import { useState } from 'react';
import { Project } from '@/types/playground';
import { Plus, X, Copy, Pencil, Check, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProjectTabsProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
}

export const ProjectTabs = ({
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  onDuplicateProject,
  onRenameProject,
}: ProjectTabsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditName(project.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onRenameProject(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin px-2 py-2 bg-muted/50 border-b border-border">
      {projects.map(project => {
        const isActive = project.id === activeProjectId;
        const isEditing = editingId === project.id;

        return (
          <div
            key={project.id}
            className={`project-tab ${isActive ? 'project-tab-active' : 'hover:bg-muted'}`}
            onClick={() => !isEditing && onSelectProject(project.id)}
          >
            <FolderOpen className="w-4 h-4 text-muted-foreground shrink-0" />
            
            {isEditing ? (
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <Input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEdit()}
                  className="h-6 w-24 text-xs px-1"
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  className="p-0.5 rounded hover:bg-primary/20 text-primary"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <span className="truncate max-w-[100px] text-sm">{project.name}</span>
                
                {isActive && (
                  <div className="flex items-center gap-0.5 ml-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(project);
                      }}
                      className="p-0.5 rounded hover:bg-muted-foreground/20 transition-colors"
                      title="Umbenennen"
                    >
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(project.id);
                      }}
                      className="p-0.5 rounded hover:bg-muted-foreground/20 transition-colors"
                      title="Duplizieren"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="p-0.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
                        title="Löschen"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onAddProject}
        className="shrink-0 h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
        title="Neues Projekt"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
