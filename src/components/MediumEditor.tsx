
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReadingProgress from './ReadingProgress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import refactored components and hooks
import EditorHeader from './editor/EditorHeader';
import CoverImageUpload from './editor/CoverImageUpload';
import EditorToolbar from './editor/EditorToolbar';
import EditorContent from './editor/EditorContent';
import EditorMetadata from './editor/EditorMetadata';
import { useEditorState } from '@/hooks/useEditorState';
import { useEditorFormatting } from '@/hooks/useEditorFormatting';

interface MediumEditorProps {
  postId?: string;
  sectionId: string;
  initialTitle?: string;
  initialContent?: any;
  initialCoverImage?: string;
  onPublish?: (published: boolean) => void;
}

const MediumEditor = ({
  postId,
  sectionId,
  initialTitle = '',
  initialContent = {},
  initialCoverImage = '',
  onPublish
}: MediumEditorProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const {
    title,
    setTitle,
    content,
    saving,
    lastSaved,
    save,
    coverImage,
    isPublished,
    excerpt,
    setExcerpt,
    category,
    setCategory,
    activeFormats,
    setActiveFormats,
    contentRef,
    handleImageUpload,
    handleContentChange,
    togglePublish,
    wordCount
  } = useEditorState({
    postId,
    sectionId,
    initialTitle,
    initialContent,
    initialCoverImage,
    onPublish
  });

  const {
    formatText,
    insertLink,
    insertNumbers
  } = useEditorFormatting({
    contentRef,
    activeFormats,
    setActiveFormats,
    handleContentChange
  });

  // Fetch sections from dashboard
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('is_active', true)
        .order('position');
      return data || [];
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <EditorHeader
        saving={saving}
        lastSaved={lastSaved}
        wordCount={wordCount}
        isPublished={isPublished}
        onSave={save}
        onPublish={togglePublish}
        onLogout={handleLogout}
      />

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Reading Progress */}
        {content.html && <ReadingProgress content={content.html} />}

        <Card className="bg-white shadow-sm border-gray-200">
          <div className="p-8">
            {/* Cover Image */}
            <CoverImageUpload
              coverImage={coverImage}
              onImageUpload={handleImageUpload}
            />

            {/* Title */}
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Your story title..." 
              className="text-4xl font-bold border-none p-0 mb-6 placeholder:text-gray-400 focus:ring-0 focus:outline-none bg-transparent resize-none h-auto min-h-[60px] text-gray-900" 
              dir="ltr"
            />

            {/* Category and Excerpt */}
            <EditorMetadata
              category={category}
              setCategory={setCategory}
              excerpt={excerpt}
              setExcerpt={setExcerpt}
              sections={sections}
            />

            {/* Formatting Toolbar */}
            <div onMouseDown={(e) => e.preventDefault()}>
              <EditorToolbar
                activeFormats={activeFormats}
                onFormat={formatText}
                onInsertLink={insertLink}
                onInsertNumbers={insertNumbers}
              />
            </div>

            {/* Content Editor */}
            <EditorContent
              content={content}
              onContentChange={handleContentChange}
              contentRef={contentRef}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MediumEditor;
