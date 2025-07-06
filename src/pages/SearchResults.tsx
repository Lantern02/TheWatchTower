import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Calendar, Eye, BookOpen, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = React.useState(query);

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return { posts: [], sections: [] };
      
      const searchTerm = `%${query.toLowerCase()}%`;
      
      // Search posts
      const { data: posts, error: postsError } = await supabase
        .from('dynamic_posts')
        .select(`
          *,
          sections (
            title,
            slug
          )
        `)
        .eq('is_published', true)
        .or(`title.ilike.${searchTerm},content->>html.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Search sections
      const { data: sections, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('is_active', true)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('title');

      if (sectionsError) throw sectionsError;

      return { posts: posts || [], sections: sections || [] };
    },
    enabled: !!query.trim(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="font-serif text-3xl font-bold text-foreground mb-6">Search Results</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts and sections..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          {query && (
            <p className="text-muted-foreground">
              Search results for: <span className="font-medium text-foreground">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Searching...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <p className="text-destructive">Failed to search. Please try again.</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="space-y-8">
            {/* Sections */}
            {results.sections.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Sections ({results.sections.length})
                </h2>
                <div className="grid gap-4">
                  {results.sections.map((section) => (
                    <Card key={section.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Link to={`/${section.slug}`} className="block">
                          <h3 className="font-serif text-lg font-semibold text-primary hover:text-primary/80 transition-colors mb-2">
                            {section.title}
                          </h3>
                          {section.description && (
                            <p className="text-muted-foreground leading-relaxed">
                              {section.description}
                            </p>
                          )}
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Posts ({results.posts.length})
                </h2>
                <div className="grid gap-6">
                  {results.posts.map((post) => {
                    const section = post.sections as any;
                    return (
                      <Card key={post.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <Link to={`/${section?.slug}/${post.slug}`} className="block group">
                            <div className="flex flex-col md:flex-row gap-4">
                              {post.cover_image_url && (
                                <div className="md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                                  <img
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-serif text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors mb-2">
                                  {post.title}
                                </h3>
                                {post.excerpt && (
                                  <p className="text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                                    {post.excerpt}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(post.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {post.view_count || 0} views
                                  </div>
                                  {section?.title && (
                                    <Badge variant="secondary">
                                      {section.title}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* No Results */}
            {results.posts.length === 0 && results.sections.length === 0 && query && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  No posts or sections match your search for "{query}". Try different keywords or browse our sections.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/">Browse All Content</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;