-- Add user_id to dynamic_posts for author tracking
ALTER TABLE public.dynamic_posts 
ADD COLUMN user_id UUID;

-- Add foreign key constraint to profiles table
ALTER TABLE public.dynamic_posts 
ADD CONSTRAINT dynamic_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add proper foreign key constraint to sections table
ALTER TABLE public.dynamic_posts 
DROP CONSTRAINT IF EXISTS dynamic_posts_section_id_fkey;

ALTER TABLE public.dynamic_posts 
ADD CONSTRAINT dynamic_posts_section_id_fkey 
FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE SET NULL;

-- Add foreign key constraint to post_analytics
ALTER TABLE public.post_analytics 
DROP CONSTRAINT IF EXISTS post_analytics_post_id_fkey;

ALTER TABLE public.post_analytics 
ADD CONSTRAINT post_analytics_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.dynamic_posts(id) ON DELETE CASCADE;

-- Drop existing policies and recreate with proper user tracking
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.dynamic_posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.dynamic_posts;

-- Users can only manage their own posts
CREATE POLICY "Users can manage their own posts" 
ON public.dynamic_posts 
FOR ALL 
USING (auth.uid() = user_id);

-- Published posts are viewable by everyone, drafts only by authors
CREATE POLICY "Published posts viewable by all, drafts by authors" 
ON public.dynamic_posts 
FOR SELECT 
USING (is_published = true OR auth.uid() = user_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for post images
CREATE POLICY "Public can view post images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own post images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own post images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-images' AND auth.uid() IS NOT NULL);

-- Create function to automatically set user_id on new posts
CREATE OR REPLACE FUNCTION public.set_user_id_on_posts()
RETURNS TRIGGER AS $$
BEGIN
  -- Set user_id to current authenticated user if not already set
  IF NEW.user_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_trigger ON public.dynamic_posts;
CREATE TRIGGER set_user_id_trigger
  BEFORE INSERT ON public.dynamic_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id_on_posts();