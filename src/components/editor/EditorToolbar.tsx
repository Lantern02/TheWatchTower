
import React from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Bold, Italic, Underline, Type, List, Link, AlignLeft } from 'lucide-react';

interface EditorToolbarProps {
  activeFormats: Set<string>;
  onFormat: (command: string, value?: string) => void;
  onInsertLink: () => void;
  onInsertNumbers: () => void;
}

const EditorToolbar = ({
  activeFormats,
  onFormat,
  onInsertLink,
  onInsertNumbers
}: EditorToolbarProps) => {
  // Prevent toolbar buttons from stealing focus
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
      <div className="flex items-center gap-1 flex-wrap">
        <Toggle 
          pressed={activeFormats.has('bold')} 
          onPressedChange={() => onFormat('bold')} 
          className="hover:bg-gray-200" 
          title="Bold (Ctrl+B)"
          onMouseDown={handleMouseDown}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={activeFormats.has('italic')} 
          onPressedChange={() => onFormat('italic')} 
          className="hover:bg-gray-200" 
          title="Italic (Ctrl+I)"
          onMouseDown={handleMouseDown}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={activeFormats.has('underline')} 
          onPressedChange={() => onFormat('underline')} 
          className="hover:bg-gray-200" 
          title="Underline (Ctrl+U)"
          onMouseDown={handleMouseDown}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Toggle
          pressed={activeFormats.has('h2')}
          onPressedChange={() => onFormat('formatBlock', activeFormats.has('h2') ? 'div' : 'h2')}
          className="hover:bg-gray-200"
          title="Heading 2"
          onMouseDown={handleMouseDown}
        >
          <Type className="h-4 w-4" />
        </Toggle>
        
        <Toggle
          pressed={activeFormats.has('h3')}
          onPressedChange={() => onFormat('formatBlock', activeFormats.has('h3') ? 'div' : 'h3')}
          className="hover:bg-gray-200 text-xs font-medium px-2"
          title="Heading 3"
          onMouseDown={handleMouseDown}
        >
          H3
        </Toggle>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('insertUnorderedList')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300" 
          title="Bullet List"
          onMouseDown={handleMouseDown}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('insertOrderedList')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300 text-xs font-medium px-2" 
          title="Numbered List"
          onMouseDown={handleMouseDown}
        >
          1.
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onInsertLink} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300" 
          title="Insert Link"
          onMouseDown={handleMouseDown}
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('justifyLeft')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300" 
          title="Align Left"
          onMouseDown={handleMouseDown}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={onInsertNumbers} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300 text-xs font-medium px-2" 
          title="Insert Numbers"
          onMouseDown={handleMouseDown}
        >
          123
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
