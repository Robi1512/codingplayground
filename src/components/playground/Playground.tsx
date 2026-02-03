import { useState } from 'react';
import { usePlayground } from '@/hooks/usePlayground';
import { DropZone } from './DropZone';
import { FileTabs } from './FileTabs';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { NewFileDialog } from './NewFileDialog';
import { Code2, Eye, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Playground = () => {
  const {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    addFile,
    updateFileContent,
    deleteFile,
    handleFileUpload,
    getPreviewHtml,
  } = usePlayground();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const clearAllFiles = () => {
    files.forEach(file => deleteFile(file.id));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="glass-panel border-b px-4 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Code Playground</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              HTML • CSS • JavaScript
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NewFileDialog onCreateFile={addFile} />
          {files.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFiles}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Alle löschen</span>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {files.length === 0 ? (
          /* Empty State - Upload Area */
          <div className="h-full flex items-center justify-center p-6">
            <div className="w-full max-w-lg">
              <DropZone onFilesDropped={handleFileUpload} />
            </div>
          </div>
        ) : (
          /* Editor/Preview Layout */
          <div className="h-full flex flex-col lg:flex-row">
            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'editor' | 'preview')}>
                <div className="px-4 pt-2 bg-muted/30">
                  <TabsList className="w-full">
                    <TabsTrigger value="editor" className="flex-1 gap-2">
                      <Code2 className="w-4 h-4" />
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="editor" className="mt-0 h-[calc(100vh-140px)]">
                  <div className="h-full flex flex-col">
                    <div className="bg-muted/30 pt-2">
                      <FileTabs
                        files={files}
                        activeFileId={activeFileId}
                        onSelectFile={setActiveFileId}
                        onDeleteFile={deleteFile}
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <CodeEditor
                        file={activeFile}
                        onContentChange={updateFileContent}
                      />
                    </div>
                    <div className="p-2 bg-muted/30">
                      <DropZone onFilesDropped={handleFileUpload} />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0 h-[calc(100vh-140px)]">
                  <div className="h-full p-4 bg-muted/30">
                    <div className="h-full rounded-xl overflow-hidden shadow-lg border border-border">
                      <Preview html={getPreviewHtml()} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Desktop Split View */}
            <div className="hidden lg:flex flex-1 overflow-hidden">
              {/* Editor Panel */}
              <div className="w-1/2 flex flex-col border-r border-border">
                <div className="bg-muted/30 pt-2 flex items-end justify-between pr-2">
                  <FileTabs
                    files={files}
                    activeFileId={activeFileId}
                    onSelectFile={setActiveFileId}
                    onDeleteFile={deleteFile}
                  />
                  <label className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors mb-1">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="file"
                      accept=".html,.htm,.css,.js"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    file={activeFile}
                    onContentChange={updateFileContent}
                  />
                </div>
              </div>

              {/* Preview Panel */}
              <div className="w-1/2 flex flex-col">
                <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Preview</span>
                </div>
                <div className="flex-1 p-4 bg-muted/30">
                  <div className="h-full rounded-xl overflow-hidden shadow-lg border border-border">
                    <Preview html={getPreviewHtml()} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
