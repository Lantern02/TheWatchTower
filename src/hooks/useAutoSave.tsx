
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [currentPostId, setCurrentPostId] = useState(postId);

  const save = useCallback(async () => {
    if (!title.trim()) {
      console.log('Cannot save: missing title');
      return;
    }
    
    setSaving(true);
    try {
      let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      // Ensure slug is not empty
      if (!slug) {
        slug = 'untitled-' + Date.now();
      }
      
      if (currentPostId) {
        // Update existing post
        const { error } = await supabase
          .from('dynamic_posts')
          .update({
            title,
            content,
            slug,
            section_id: content.category || sectionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentPostId);
          
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
      } else {
        // Create new post as draft
        const { data, error } = await supabase
          .from('dynamic_posts')
          .insert([{
            section_id: content.category || sectionId,
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
        
        // Update current post ID and URL
        if (data) {
          setCurrentPostId(data.id);
          window.history.replaceState({}, '', `/admin/posts/${data.id}`);
        }
      }
      
      setLastSaved(new Date());
      console.log('Post saved successfully');

      // Also save to localStorage as backup
      const draftData = {
        id: currentPostId || 'temp-' + Date.now(),
        title,
        content: content.html || '',
        lastModified: new Date(),
        wordCount: content.html ? content.html.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length : 0,
        status: 'draft' as const
      };

      const existingDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
      const draftIndex = existingDrafts.findIndex((draft: any) => draft.id === draftData.id);
      
      if (draftIndex >= 0) {
        existingDrafts[draftIndex] = draftData;
      } else {
        existingDrafts.push(draftData);
      }
      
      localStorage.setItem('drafts', JSON.stringify(existingDrafts));
      
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error('Save failed: ' + (error.message || 'An error occurred while saving'));
    } finally {
      setSaving(false);
    }
  }, [title, content, currentPostId, sectionId]);

  // Auto-save every 5 seconds when content changes
  useEffect(() => {
    if (!title.trim()) return;
    
    const timer = setTimeout(() => {
      if (title !== initialTitle || JSON.stringify(content) !== JSON.stringify(initialContent)) {
        save();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, save, initialTitle, initialContent]);

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
