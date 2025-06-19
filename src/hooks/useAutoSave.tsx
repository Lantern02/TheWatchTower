
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveProps {
  postId?: string;
  sectionId: string;
  initialTitle?: string;
  initialContent?: any;
}

export const useAutoSave = ({ postId, sectionId, initialTitle = '', initialContent = {} }: UseAutoSaveProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const save = useCallback(async () => {
    if (!title.trim() || !sectionId) {
      console.log('Cannot save: missing title or sectionId');
      return;
    }
    
    setSaving(true);
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      if (postId) {
        // Update existing post
        const { error } = await supabase
          .from('dynamic_posts')
          .update({
            title,
            content,
            slug,
            updated_at: new Date().toISOString()
          })
          .eq('id', postId);
          
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('dynamic_posts')
          .insert([{
            section_id: sectionId,
            title,
            content,
            slug,
            is_published: false
          }])
          .select()
          .single();
          
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        // Update URL to include new post ID
        if (data) {
          window.history.replaceState({}, '', `/admin/posts/${data.id}`);
        }
      }
      
      setLastSaved(new Date());
      console.log('Post saved successfully');
    } catch (error: any) {
      console.error('Save failed:', error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || 'An error occurred while saving',
      });
    } finally {
      setSaving(false);
    }
  }, [title, content, postId, sectionId, toast]);

  // Auto-save every 3 seconds when content changes
  useEffect(() => {
    if (!title.trim() || !sectionId) return;
    
    const timer = setTimeout(() => {
      if (title !== initialTitle || JSON.stringify(content) !== JSON.stringify(initialContent)) {
        save();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, save, initialTitle, initialContent, sectionId]);

  return {
    title,
    setTitle,
    content,
    setContent,
    saving,
    lastSaved,
    save
  };
};
