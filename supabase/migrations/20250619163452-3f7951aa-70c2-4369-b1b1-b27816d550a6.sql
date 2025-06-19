
-- Create a table for dynamic sections/content
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  show_in_navigation BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table for dynamic content
CREATE TABLE public.dynamic_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB DEFAULT '{}'::jsonb,
  excerpt TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  read_completion_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section_id, slug)
);

-- Create analytics table for tracking user interactions
CREATE TABLE public.post_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.dynamic_posts(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'read_start', 'read_complete', 'scroll_progress'
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published content
CREATE POLICY "Anyone can view active sections" ON public.sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view published posts" ON public.dynamic_posts
  FOR SELECT USING (is_published = true);

-- Admin policies (you'll need to be authenticated to modify)
CREATE POLICY "Authenticated users can manage sections" ON public.sections
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage posts" ON public.dynamic_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view analytics" ON public.post_analytics
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Allow anyone to insert analytics data
CREATE POLICY "Anyone can insert analytics" ON public.post_analytics
  FOR INSERT WITH CHECK (true);

-- Insert default sections
INSERT INTO public.sections (title, slug, description, show_in_navigation, position) VALUES
('Blog', 'blog', 'Reflections on life, literature, and the spaces between words where meaning lives.', true, 1),
('Poetry', 'poetry', 'Verses that capture the fleeting moments, the quiet observations, the sacred ordinary.', true, 2),
('Prophecy', 'prophecy', 'Visions and insights into what lies beyond the veil of the present moment.', true, 3);

-- Create auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dynamic_posts_updated_at BEFORE UPDATE ON public.dynamic_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
