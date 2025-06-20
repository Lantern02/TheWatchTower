
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bookmark, Clock, User, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Bookmarks = () => {
  const { user } = useAuth();

  const { data: bookmarkedPosts, isLoading, refetch } = useQuery({
    queryKey: ['bookmarked-posts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // For now, we'll simulate bookmarks using localStorage
      // In a real app, you'd have a bookmarks table in your database
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      
      if (bookmarks.length === 0) return [];

      const { data } = await supabase
        .from('dynamic_posts')
        .select(`
          *,
          sections!inner(title, slug)
        `)
        .in('id', bookmarks)
        .eq('is_published', true);
      
      return data || [];
    },
    enabled: !!user,
  });

  const removeBookmark = (postId: string) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const updatedBookmarks = bookmarks.filter((id: string) => id !== postId);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    refetch();
    toast.success('Bookmark removed');
  };

  const getPostPreview = (post: any) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content && typeof post.content === 'object' && !Array.isArray(post.content) && post.content.html) {
      return post.content.html.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    }
    
    return 'No preview available';
  };

  if (!user) {
    return (
      <div className="section-container">
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Sign in to view bookmarks</h1>
          <p className="text-gray-400 mb-6">Save articles to read later by signing in to your account</p>
          <Link to="/auth">
            <Button className="bg-blue-500 hover:bg-blue-600">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="section-container">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-8"></div>
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="h-8 w-8 text-blue-400" />
          <h1 className="text-4xl font-serif font-bold text-white">Your Bookmarks</h1>
        </div>
        <p className="text-xl text-gray-300">
          Articles you've saved to read later
        </p>
      </div>

      <div className="space-y-6">
        {bookmarkedPosts?.map((post) => (
          <Card key={post.id} className="bg-slate-800 border-slate-700 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-slate-600 text-gray-300">
                    {post.sections?.title}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(post.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-xl font-serif hover:text-blue-400 transition-colors">
                <Link to={`/${post.sections?.slug}/${post.slug}`}>
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {getPostPreview(post)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="h-4 w-4" />
                  <span>By Author</span>
                </div>
                <Link 
                  to={`/${post.sections?.slug}/${post.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!bookmarkedPosts || bookmarkedPosts.length === 0) && (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No bookmarked articles yet</p>
          <p className="text-gray-500">Start exploring and save articles you want to read later!</p>
          <Link to="/">
            <Button variant="outline" className="mt-4 border-slate-600 text-gray-300 hover:bg-slate-700">
              Explore Articles
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
