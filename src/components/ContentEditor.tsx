
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Edit, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentSection {
  id: string;
  key: string;
  title: string;
  content: string;
  page: string;
}

interface ContentEditorProps {
  page: string;
  sectionKey: string;
  title: string;
  defaultContent: string;
  className?: string;
}

const ContentEditor = ({ page, sectionKey, title, defaultContent, className }: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState(title);
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery({
    queryKey: ['page-content', page, sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', page)
        .eq('key', sectionKey)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || { title, content: defaultContent };
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page,
          key: sectionKey,
          title: data.title,
          content: data.content
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-content', page, sectionKey] });
      setIsEditing(false);
      toast.success('Content saved successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to save content: ' + error.message);
    },
  });

  useEffect(() => {
    if (content) {
      setEditTitle(content.title || title);
      setEditContent(content.content || defaultContent);
    }
  }, [content, title, defaultContent]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    saveMutation.mutate({
      title: editTitle,
      content: editContent
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (content) {
      setEditTitle(content.title || title);
      setEditContent(content.content || defaultContent);
    }
  };

  if (isLoading) {
    return <div className={className}>Loading...</div>;
  }

  const displayContent = content?.content || defaultContent;
  const displayTitle = content?.title || title;

  if (isEditing) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Edit Content</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Section title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
              placeholder="Enter your content here..."
              className="min-h-[200px]"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="group relative">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: displayContent.replace(/\n/g, '<br />') 
          }}
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
          onClick={handleEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ContentEditor;
