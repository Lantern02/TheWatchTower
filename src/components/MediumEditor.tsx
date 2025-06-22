
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReadingProgress from './ReadingProgress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import refactored components
import EditorHeader from './editor/EditorHeader';
import CoverImageUpload from './editor/CoverImageUpload';
import EditorToolbar from './editor/EditorToolbar';
import EditorContent from './editor/EditorContent';

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
    setContent,
    saving,
    lastSaved,
    save
  } = useAutoSave({
    postId,
    sectionId,
    initialTitle,
    initialContent
  });

  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [isPublished, setIsPublished] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML;
      setContent({
        html: htmlContent,
        category: category
      });
    }
  };

  const togglePublish = async () => {
    if (!title.trim()) {
      toast.error('Please add a title before publishing');
      return;
    }
    
    if (!category) {
      toast.error('Please select a category before publishing');
      return;
    }

    try {
      const newPublishState = !isPublished;
      
      // First save the post
      await save();
      
      // Then update the published status
      if (postId) {
        const { error } = await supabase
          .from('dynamic_posts')
          .update({ 
            is_published: newPublishState,
            section_id: category,
            excerpt: excerpt || content.html?.replace(/<[^>]*>/g, '').substring(0, 200)
          })
          .eq('id', postId);
          
        if (error) throw error;
        
        setIsPublished(newPublishState);
        onPublish?.(newPublishState);
        
        toast.success(newPublishState ? 'Post published successfully!' : 'Post unpublished');
      }
    } catch (error: any) {
      toast.error('Failed to publish post: ' + error.message);
    }
  };

  const formatText = (command: string, value?: string) => {
    // Ensure the contentEditable element is focused
    if (contentRef.current) {
      contentRef.current.focus();
    }
    
    // Execute the formatting command
    document.execCommand(command, false, value);
    
    // Update content and active formats
    handleContentChange();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    // Check if commands are active
    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('underline')) formats.add('underline');
    } catch (error) {
      // Some browsers might not support all commands
      console.warn('Format detection error:', error);
    }
    
    setActiveFormats(formats);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url && contentRef.current) {
      contentRef.current.focus();
      formatText('createLink', url);
    }
  };

  const insertNumbers = () => {
    if (contentRef.current) {
      contentRef.current.focus();
      
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // Create a text node with numbers
        const numbersText = document.createTextNode('1 2 3 4 5 6 7 8 9 10 ');
        
        range.deleteContents();
        range.insertNode(numbersText);
        
        // Move cursor to end of inserted text
        range.setStartAfter(numbersText);
        range.setEndAfter(numbersText);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // Fallback: append to end
        const numbersText = document.createTextNode('1 2 3 4 5 6 7 8 9 10 ');
        contentRef.current.appendChild(numbersText);
      }
      
      handleContentChange();
    }
  };

  // Calculate word count
  const wordCount = content.html ? content.html.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length : 0;

  // Update active formats when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      // Only update if the selection is within our editor
      const selection = window.getSelection();
      if (selection && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        updateActiveFormats();
      }
    };

    const handleMouseUp = () => {
      // Update formats on mouse up (after selection change)
      setTimeout(updateActiveFormats, 10);
    };

    const handleKeyUp = () => {
      // Update formats on key up (after potential formatting changes)
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

  // Update category when it changes
  useEffect(() => {
    if (category) {
      setContent(prev => ({
        ...prev,
        category: category
      }));
    }
  }, [category, setContent]);

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

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full max-w-xs bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {sections?.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Brief description)
              </label>
              <Input 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)} 
                placeholder="What's your story about?" 
                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                dir="ltr"
              />
            </div>

            {/* Formatting Toolbar */}
            <EditorToolbar
              activeFormats={activeFormats}
              onFormat={formatText}
              onInsertLink={insertLink}
              onInsertNumbers={insertNumbers}
            />

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
