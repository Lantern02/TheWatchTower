
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
    save,
    currentPostId
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

  // Load initial publish state and other data when postId is available
  useEffect(() => {
    const loadPostData = async () => {
      const idToLoad = currentPostId || postId;
      if (idToLoad) {
        try {
          const { data, error } = await supabase
            .from('dynamic_posts')
            .select('*')
            .eq('id', idToLoad)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setIsPublished(data.is_published || false);
            setExcerpt(data.excerpt || '');
            setCategory(data.section_id || '');
          }
        } catch (error) {
          console.error('Error loading post data:', error);
        }
      }
    };

    loadPostData();
  }, [currentPostId, postId]);

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
      
      // First save the current content
      await save();
      
      // Then update the publish state using the current post ID
      const idToUpdate = currentPostId || postId;
      if (idToUpdate) {
        const { error } = await supabase
          .from('dynamic_posts')
          .update({ 
            is_published: newPublishState,
            section_id: category,
            excerpt: excerpt || content.html?.replace(/<[^>]*>/g, '').substring(0, 200),
            updated_at: new Date().toISOString()
          })
          .eq('id', idToUpdate);
          
        if (error) throw error;
        
        setIsPublished(newPublishState);
        onPublish?.(newPublishState);
        
        toast.success(newPublishState ? 'Post published successfully!' : 'Post unpublished');
      } else {
        toast.error('Please save the post first before publishing');
      }
    } catch (error: any) {
      console.error('Publish error:', error);
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
    wordCount,
    currentPostId
  };
};
