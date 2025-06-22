
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UseAutoSaveProps {
  postId?: string;
  sectionId: string;
  initialTitle?: string;
  initialContent?: any;
}

export const useAutoSave = ({
  postId,
  sectionId,
  initialTitle = '',
  initialContent = {}
}: UseAutoSaveProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save when title or content changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only auto-save if we have content or title and user is authenticated
    if ((title.trim() || (content.html && content.html.trim())) && user) {
      saveTimeoutRef.current = setTimeout(() => {
        save();
      }, 2000); // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, user]);

  const save = async () => {
    if (!user) {
      toast.error('Please log in to save your work');
      return;
    }

    if (!title.trim()) {
      return; // Don't save without a title
    }

    setSaving(true);

    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      const postData = {
        title,
        slug,
        content,
        section_id: sectionId || null,
        user_id: user.id, // Include user_id for RLS
        updated_at: new Date().toISOString()
      };

      if (postId) {
        // Update existing post
        const { error } = await supabase
          .from('dynamic_posts')
          .update(postData)
          .eq('id', postId);
          
        if (error) throw error;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('dynamic_posts')
          .insert([postData])
          .select()
          .single();
          
        if (error) throw error;
        
        // Update the URL to include the new post ID
        if (data && window.history.replaceState) {
          window.history.replaceState(null, '', `/admin/posts/${data.id}`);
        }
      }

      setLastSaved(new Date());
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

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
