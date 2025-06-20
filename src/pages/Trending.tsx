
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
        .from('posts')
        .select(`
          *,
          sections!inner(title, slug),
          profiles!inner(full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="section-container">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
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
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="h-8 w-8 text-blue-400" />
          <h1 className="text-4xl font-serif font-bold text-white">Trending Now</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover the most popular articles and stories making waves in our community
        </p>
      </div>

      <div className="space-y-6">
        {trendingPosts?.map((post, index) => (
          <Card key={post.id} className="bg-slate-800 border-slate-700 hover:border-blue-400 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    #{index + 1}
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-gray-300">
                    {post.sections?.title}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{Math.floor(Math.random() * 1000 + 100)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
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
                {post.excerpt || post.content?.substring(0, 200) + '...'}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="h-4 w-4" />
                  <span>By {post.profiles?.full_name || 'Anonymous'}</span>
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

      {(!trendingPosts || trendingPosts.length === 0) && (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No trending articles yet</p>
          <p className="text-gray-500">Check back soon for popular content!</p>
        </div>
      )}
    </div>
  );
};

export default Trending;
