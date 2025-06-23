
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, Clock, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Trending = () => {
  const { data: trendingPosts, isLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('dynamic_posts')
        .select(`
          *,
          sections!inner(title, slug)
        `)
        .eq('is_published', true)
        .order('view_count', { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-orange-200">
                <CardHeader>
                  <div className="h-4 bg-orange-100 rounded w-3/4"></div>
                  <div className="h-3 bg-orange-100 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-orange-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-orange-100 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getPostPreview = (post: any) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content && typeof post.content === 'object' && !Array.isArray(post.content) && post.content.html) {
      return post.content.html.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    }
    
    return 'No preview available';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <TrendingUp className="h-12 w-12 text-orange-700 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mb-4">
            Trending Now
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular articles and stories making waves in our community
          </p>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          {trendingPosts?.map((post, index) => (
            <Card key={post.id} className="border-orange-200 hover:border-orange-400 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-orange-500 text-white hover:bg-orange-600">
                      #{index + 1}
                    </Badge>
                    <Badge variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                      {post.sections?.title}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-serif hover:text-orange-700 transition-colors">
                  <Link to={`/${post.sections?.slug}/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {getPostPreview(post)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>By Author</span>
                  </div>
                  <Link 
                    to={`/${post.sections?.slug}/${post.slug}`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!trendingPosts || trendingPosts.length === 0) && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-orange-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No trending articles yet</p>
            <p className="text-gray-500">Check back soon for popular content!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Trending;
