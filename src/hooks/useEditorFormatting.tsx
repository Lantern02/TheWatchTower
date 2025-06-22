
import { useEffect } from 'react';

interface UseEditorFormattingProps {
  contentRef: React.RefObject<HTMLDivElement>;
  activeFormats: Set<string>;
  setActiveFormats: (formats: Set<string>) => void;
  handleContentChange: () => void;
}

export const useEditorFormatting = ({
  contentRef,
  activeFormats,
  setActiveFormats,
  handleContentChange
}: UseEditorFormattingProps) => {
  const formatText = (command: string, value?: string) => {
    if (!contentRef.current) return;
    
    const selection = window.getSelection();
    let savedRange = null;
    
    if (selection && selection.rangeCount > 0) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
    
    contentRef.current.focus();
    
    if (savedRange) {
      const newSelection = window.getSelection();
      if (newSelection) {
        newSelection.removeAllRanges();
        newSelection.addRange(savedRange);
      }
    }
    
    try {
      const success = document.execCommand(command, false, value);
      console.log(`Command ${command} executed:`, success);
      
      if (contentRef.current) {
        contentRef.current.focus();
      }
      
      setTimeout(() => {
        handleContentChange();
        updateActiveFormats();
      }, 10);
    } catch (error) {
      console.error('Format command failed:', error);
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('underline')) formats.add('underline');
    } catch (error) {
      console.warn('Format detection error:', error);
    }
    
    setActiveFormats(formats);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
    if (contentRef.current) {
      setTimeout(() => contentRef.current?.focus(), 100);
    }
  };

  const insertNumbers = () => {
    if (contentRef.current) {
      contentRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const numbersText = document.createTextNode('1 2 3 4 5 6 7 8 9 10 ');
        
        range.deleteContents();
        range.insertNode(numbersText);
        
        range.setStartAfter(numbersText);
        range.setEndAfter(numbersText);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const numbersText = document.createTextNode('1 2 3 4 5 6 7 8 9 10 ');
        contentRef.current.appendChild(numbersText);
      }
      
      contentRef.current.focus();
      handleContentChange();
    }
  };

  // Update active formats when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        updateActiveFormats();
      }
    };

    const handleMouseUp = () => {
      setTimeout(updateActiveFormats, 10);
    };

    const handleKeyUp = () => {
      setTimeout(updateActiveFormats, 10);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    if (contentRef.current) {
      contentRef.current.addEventListener('mouseup', handleMouseUp);
      contentRef.current.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (contentRef.current) {
        contentRef.current.removeEventListener('mouseup', handleMouseUp);
        contentRef.current.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, []);

  return {
    formatText,
    insertLink,
    insertNumbers,
    updateActiveFormats
  };
};
