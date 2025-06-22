
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Eye, EyeOff, LogOut } from 'lucide-react';

interface EditorHeaderProps {
  saving: boolean;
  lastSaved: Date | null;
  wordCount: number;
  isPublished: boolean;
  onSave: () => void;
  onPublish: () => void;
  onLogout: () => void;
}

const EditorHeader = ({
  saving,
  lastSaved,
  wordCount,
  isPublished,
  onSave,
  onPublish,
  onLogout
}: EditorHeaderProps) => {
  return (
    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  `Saved ${lastSaved.toLocaleTimeString()}`
                ) : (
                  'Draft'
                )}
              </span>
              <span className="text-sm text-gray-500">
                {wordCount} words
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="outline" size="sm" onClick={onSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant={isPublished ? "default" : "outline"} 
              size="sm" 
              onClick={onPublish}
              className={isPublished ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isPublished ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {isPublished ? 'Published' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
