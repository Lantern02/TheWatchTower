
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, User, Search } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

const SearchResults = ({ query, onClose }: SearchResultsProps) => {
  const { data: results, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const { data } = await supabase
        .from('dynamic_posts')
        .select(`
          *,
          sections!inner(title, slug)
        `)
        .eq('is_published', true)
        .or(`title.ilike.%${query}%,content->>html.ilike.%${query}%`)
        .limit(10);
      
      return data || [];
    },
    enabled: !!query.trim(),
  });

  const getPostPreview = (post: any) => {
    if (post.excerpt) return post.excerpt;
    
    if (post.content && typeof post.content === 'object' && !Array.isArray(post.content) && post.content.html) {
      return post.content.html.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
    }
    
    return 'No preview available';
  };

  if (!query.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-700 rounded-lg mt-2 max-h-96 overflow-y-auto z-50 shadow-xl">
      {isLoading ? (
        <div className="p-4 text-center text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2" />
          Searching...
        </div>
      ) : results?.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <Search className="h-8 w-8 mx-auto mb-2" />
          No results found for "{query}"
        </div>
      ) : (
        <div className="p-2">
          <div className="text-sm text-gray-400 px-2 py-1 mb-2">
            Found {results?.length} result{results?.length !== 1 ? 's' : ''}
          </div>
          {results?.map((post) => (
            <Link
              key={post.id}
              to={`/${post.sections?.slug}/${post.slug}`}
              onClick={onClose}
              className="block p-3 hover:bg-slate-700 rounded transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white line-clamp-1">{post.title}</h3>
                <Badge variant="outline" className="border-slate-600 text-gray-300 ml-2 flex-shrink-0">
                  {post.sections?.title}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                {getPostPreview(post)}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Author</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
