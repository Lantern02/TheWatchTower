
import React, { useRef, useEffect, useState } from 'react';

interface EditorContentProps {
  content: any;
  onContentChange: () => void;
  contentRef?: React.RefObject<HTMLDivElement>;
}

const EditorContent = ({ content, onContentChange, contentRef }: EditorContentProps) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const editorRef = contentRef || internalRef;
  const [hasText, setHasText] = useState(false);
  const [isUpdatingContent, setIsUpdatingContent] = useState(false);

  // Focus the editor when component mounts
  useEffect(() => {
    if (editorRef.current && !content.html) {
      editorRef.current.focus();
    }
  }, []);

  // Save and restore cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  const restoreCursorPosition = (savedPosition: number) => {
    if (!editorRef.current) return;
    
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let currentPosition = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const textLength = node.textContent?.length || 0;
      if (currentPosition + textLength >= savedPosition) {
        const range = document.createRange();
        const selection = window.getSelection();
        const offset = savedPosition - currentPosition;
        
        range.setStart(node, Math.min(offset, textLength));
        range.setEnd(node, Math.min(offset, textLength));
        
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        break;
      }
      currentPosition += textLength;
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const textContent = editorRef.current.innerText || editorRef.current.textContent || '';
      setHasText(textContent.trim().length > 0);
    }
    onContentChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false);
          handleInput();
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false);
          handleInput();
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false);
          handleInput();
          break;
      }
    }
  };

  const handleClick = () => {
    // Ensure focus is maintained when clicking in the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Update content only when not actively typing
  useEffect(() => {
    if (editorRef.current && content.html && !isUpdatingContent) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== content.html) {
        const cursorPosition = saveCursorPosition();
        editorRef.current.innerHTML = content.html;
        setTimeout(() => restoreCursorPosition(cursorPosition), 0);
      }
    }
  }, [content.html, isUpdatingContent]);

  // Check if there's actual text content (not just HTML tags)
  const hasContent = content.html && content.html.replace(/<[^>]*>/g, '').trim().length > 0;

  return (
    <div className="relative">
      <div 
        ref={editorRef} 
        contentEditable 
        suppressContentEditableWarning={true}
        className="min-h-96 prose prose-lg max-w-none focus:outline-none text-gray-900 border-2 border-gray-300 rounded-lg p-6 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={() => setIsUpdatingContent(false)}
        onBlur={() => setIsUpdatingContent(false)}
        style={{
          fontSize: '18px',
          lineHeight: '1.7',
          letterSpacing: '-0.003em',
          direction: 'ltr',
          textAlign: 'left'
        }}
        dir="ltr"
        spellCheck="true"
      />
      
      {!hasContent && !hasText && (
        <div className="absolute top-6 left-6 pointer-events-none text-gray-400 text-lg" style={{ direction: 'ltr', textAlign: 'left' }}>
          Start writing your story...
        </div>
      )}
    </div>
  );
};

export default EditorContent;
