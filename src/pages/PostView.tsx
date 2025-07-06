import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Eye, BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactionsBar from '@/components/ReactionsBar';
import CommentsSection from '@/components/CommentsSection';
import ReadingProgress from '@/components/ReadingProgress';

const PostView = () => {
  const { sectionSlug, postSlug } = useParams<{ sectionSlug: string; postSlug: string }>();
  const navigate = useNavigate();

  // Fetch the post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', sectionSlug, postSlug],
    queryFn: async () => {
      if (!sectionSlug || !postSlug) return null;
      
      const { data, error } = await supabase
        .from('dynamic_posts')
        .select(`
          *,
          sections (
            title,
            slug,
            description
          )
        `)
        .eq('slug', postSlug)
        .eq('is_published', true)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!sectionSlug && !!postSlug,
  });

  // Track page view
  useEffect(() => {
    const trackView = async () => {
      if (post?.id) {
        // Increment view count
        await supabase
          .from('dynamic_posts')
          .update({ view_count: (post.view_count || 0) + 1 })
          .eq('id', post.id);

        // Track analytics
        const sessionId = Date.now().toString();
        await supabase
          .from('post_analytics')
          .insert({
            post_id: post.id,
            event_type: 'page_view',
            session_id: sessionId,
            event_data: {
              referrer: document.referrer,
              timestamp: new Date().toISOString()
            }
          });
      }
    };

    trackView();
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Post not found</h1>
          <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const section = post.sections as any;
  const content = post.content as { html?: string };

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress content={content?.html || ''} />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/${sectionSlug}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {section?.title || 'Section'}
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <BookOpen className="h-4 w-4" />
            <Link 
              to={`/${sectionSlug}`}
              className="hover:text-primary transition-colors"
            >
              {section?.title}
            </Link>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-8">
        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="w-full h-64 md:h-96 mb-8 overflow-hidden rounded-xl">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title and Meta */}
        <header className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{(post.view_count || 0) + 1} views</span>
            </div>
            {section?.title && (
              <Badge variant="secondary">
                {section.title}
              </Badge>
            )}
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: content?.html || '' }}
        />

        {/* Reactions and Sharing */}
        <div className="mt-12 pt-8 border-t border-border">
          <ReactionsBar 
            postId={post.id} 
            initialClaps={0}
            onBookmarkToggle={(bookmarked) => {
              console.log('Bookmark toggled:', bookmarked);
            }}
          />
        </div>

        {/* Comments */}
        <div className="mt-8">
          <CommentsSection postId={post.id} />
        </div>
      </article>

      {/* Related Posts */}
      <section className="bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
            More from {section?.title}
          </h2>
          <div className="text-muted-foreground">
            <p>Related posts will appear here...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostView;