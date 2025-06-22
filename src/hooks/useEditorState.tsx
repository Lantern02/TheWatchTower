
import { useState, useRef, useEffect } from 'react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseEditorStateProps {
  postId?: string;
  sectionId: string;
  initialTitle?: string;
  initialContent?: any;
  initialCoverImage?: string;
  onPublish?: (published: boolean) => void;
}

export const useEditorState = ({
  postId,
  sectionId,
  initialTitle = '',
  initialContent = {},
  initialCoverImage = '',
  onPublish
}: UseEditorStateProps) => {
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
      
      await save();
      
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

  const wordCount = content.html ? content.html.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length : 0;

  // Update category when it changes
  useEffect(() => {
    if (category) {
      setContent(prev => ({
        ...prev,
        category: category
      }));
    }
  }, [category, setContent]);

  return {
    title,
    setTitle,
    content,
    setContent,
    saving,
    lastSaved,
    save,
    coverImage,
    setCoverImage,
    isPublished,
    setIsPublished,
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
  };
};
