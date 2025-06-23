import React, { useState, useEffect } from 'react';
import { FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import DraftCard from './DraftCard';

interface Draft {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  status: 'draft' | 'published';
  sectionTitle?: string;
  sectionSlug?: string;
  slug?: string;
}

const DraftManager = () => {
  const { user } = useAuth();
  const [localDrafts, setLocalDrafts] = useState<Draft[]>([]);

  // Fetch drafts from database - only for authenticated users
  const { data: dbDrafts, refetch } = useQuery({
    queryKey: ['drafts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('dynamic_posts')
          .select(`
            id,
            title,
            content,
            updated_at,
            is_published,
            slug,
            sections (
              title,
              slug
            )
          `)
          .order('updated_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching drafts:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in queryFn:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  useEffect(() => {
    // Load local drafts from localStorage
    const savedDrafts = localStorage.getItem('drafts');
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts).map((draft: any) => ({
        ...draft,
        lastModified: new Date(draft.lastModified)
      }));
      setLocalDrafts(parsedDrafts);
    }
  }, []);

  // Combine and deduplicate drafts from database and localStorage
  const allDrafts = React.useMemo(() => {
    const combined: Draft[] = [];
    
    // Add database drafts
    if (dbDrafts) {
      dbDrafts.forEach(post => {
        let contentText = '';
        
        // Safely extract text content from JSONB
        if (post.content && typeof post.content === 'object' && !Array.isArray(post.content)) {
          const contentObj = post.content as { html?: string };
          if (contentObj.html) {
            contentText = contentObj.html.replace(/<[^>]*>/g, '');
          }
        }
        
        combined.push({
          id: post.id,
          title: post.title,
          content: contentText,
          lastModified: new Date(post.updated_at),
          wordCount: contentText.split(/\s+/).filter(word => word.length > 0).length,
          status: post.is_published ? 'published' : 'draft',
          sectionTitle: (post.sections as any)?.title,
          sectionSlug: (post.sections as any)?.slug,
          slug: post.slug
        });
      });
    }
    
    // Add local drafts that aren't in database (only for backwards compatibility)
    localDrafts.forEach(localDraft => {
      if (!combined.find(d => d.id === localDraft.id)) {
        combined.push(localDraft);
      }
    });
    
    return combined.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }, [dbDrafts, localDrafts]);

  const deleteDraft = async (id: string) => {
    if (!user) {
      toast.error('Please log in to delete drafts');
      return;
    }

    try {
      // Try to delete from database first
      const { error } = await supabase
        .from('dynamic_posts')
        .delete()
        .eq('id', id);
      
      if (!error) {
        refetch();
        toast.success('Draft deleted successfully');
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
    
    // Also remove from localStorage if it exists there
    const updatedLocalDrafts = localDrafts.filter(draft => draft.id !== id);
    setLocalDrafts(updatedLocalDrafts);
    localStorage.setItem('drafts', JSON.stringify(updatedLocalDrafts));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8">
          <CardContent className="text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Please log in to view your drafts</p>
            <Link to="/auth">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-orange-400" />
          <h2 className="text-2xl font-serif font-bold text-white">Your Drafts</h2>
        </div>
        <Link to="/admin/posts/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            New Draft
          </Button>
        </Link>
      </div>

      {allDrafts.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No drafts yet</p>
            <Link to="/admin/posts/new">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Start Writing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allDrafts.map((draft) => (
            <DraftCard 
              key={draft.id} 
              draft={draft} 
              onDelete={deleteDraft}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftManager;
