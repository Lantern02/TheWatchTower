
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
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
      <div className="flex items-center gap-1 flex-wrap">
        <Toggle 
          pressed={activeFormats.has('bold')} 
          onPressedChange={() => onFormat('bold')} 
          className="hover:bg-gray-200" 
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={activeFormats.has('italic')} 
          onPressedChange={() => onFormat('italic')} 
          className="hover:bg-gray-200" 
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        
        <Toggle 
          pressed={activeFormats.has('underline')} 
          onPressedChange={() => onFormat('underline')} 
          className="hover:bg-gray-200" 
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('formatBlock', 'h2')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300" 
          title="Heading 2"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('formatBlock', 'h3')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300 text-xs font-medium px-2" 
          title="Heading 3"
        >
          H3
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => onFormat('insertUnorderedList')} 
          className="hover:bg-gray-200 border border-transparent hover:border-gray-300" 
          title="Bullet List"
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
        >
          123
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
