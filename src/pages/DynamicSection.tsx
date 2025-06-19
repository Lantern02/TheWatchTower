
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';

const DynamicSection = () => {
  const { slug } = useParams();

  const { data: section } = useQuery({
    queryKey: ['section', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ['section-posts', section?.id],
    queryFn: async () => {
      if (!section?.id) return [];
      const { data } = await supabase
        .from('dynamic_posts')
        .select('*')
        .eq('section_id', section.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!section?.id,
  });

  if (!section) {
    return (
      <div className="section-container text-center">
        <h1 className="text-2xl font-serif">Section not found</h1>
      </div>
    );
  }

  return (
    <div className="section-container">
      {/* Section Header */}
      <div className="text-center mb-16">
        {section.cover_image_url && (
          <div className="w-full h-64 mb-8 overflow-hidden rounded-xl">
            <img
              src={section.cover_image_url}
              alt={section.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-6">
          {section.title}
        </h1>
        {section.description && (
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
            {section.description}
          </p>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
            <Link to={`/${section.slug}/${post.slug}`}>
              {post.cover_image_url && (
                <div className="overflow-hidden rounded-t-lg">
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-serif text-xl font-semibold text-primary group-hover:text-amber-700 transition-colors duration-300 mb-3">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.view_count || 0} views
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No posts yet in this section.</p>
        </div>
      )}
    </div>
  );
};

export default DynamicSection;
