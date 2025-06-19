
-- Create user profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table for blog entries, poetry, parables
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL CHECK (category IN ('blog', 'poetry', 'parables')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book recommendations table
CREATE TABLE public.book_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  recommendation_text TEXT NOT NULL,
  cover_image_url TEXT,
  amazon_link TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies (public read, authenticated admin write)
CREATE POLICY "Published posts are viewable by everyone" ON public.posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Authors can insert their own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = author_id);

-- Book recommendations policies (public read, admin write)
CREATE POLICY "Book recommendations are viewable by everyone" ON public.book_recommendations
  FOR SELECT USING (true);

-- Only authenticated users can manage book recommendations (you'll need to be logged in)
CREATE POLICY "Authenticated users can insert book recommendations" ON public.book_recommendations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update book recommendations" ON public.book_recommendations
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete book recommendations" ON public.book_recommendations
  FOR DELETE TO authenticated USING (true);

-- Newsletter subscribers policies (public insert for signup, no read access)
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can view subscribers (admin access)
CREATE POLICY "Only authenticated users can view subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (true);

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update post slugs
CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  NEW.slug := trim(both '-' from NEW.slug);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slugs
CREATE TRIGGER generate_post_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug_from_title();
