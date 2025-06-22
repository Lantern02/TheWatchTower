
import React, { useRef, useEffect } from 'react';

interface EditorContentProps {
  content: any;
  onContentChange: () => void;
}

const EditorContent = ({ content, onContentChange }: EditorContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus the editor when component mounts
  useEffect(() => {
    if (contentRef.current && !content.html) {
      contentRef.current.focus();
    }
  }, []);

  return (
    <div className="relative">
      <div 
        ref={contentRef} 
        contentEditable 
        suppressContentEditableWarning={true}
        className="min-h-96 prose prose-lg max-w-none focus:outline-none text-gray-900 border-2 border-gray-300 rounded-lg p-6 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
        onInput={onContentChange}
        style={{
          fontSize: '18px',
          lineHeight: '1.7',
          letterSpacing: '-0.003em',
          direction: 'ltr',
          textAlign: 'left'
        }}
        dangerouslySetInnerHTML={{
          __html: content.html || ''
        }}
        dir="ltr"
        spellCheck="true"
      />
      
      {(!content.html || content.html === '') && (
        <div className="absolute top-6 left-6 pointer-events-none text-gray-400 text-lg" style={{ direction: 'ltr', textAlign: 'left' }}>
          Start writing your story... Click the "1-10" button above to test English writing direction.
        </div>
      )}
    </div>
  );
};

export default EditorContent;
