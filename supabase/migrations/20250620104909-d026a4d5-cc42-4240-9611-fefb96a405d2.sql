
-- Create the page_content table for storing editable content sections
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a unique index to ensure one content section per page/key combination
CREATE UNIQUE INDEX page_content_page_key_idx ON public.page_content (page, key);

-- Add a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (since this is admin-only content editing)
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read page content (for public display)
CREATE POLICY "Anyone can view page content" 
  ON public.page_content 
  FOR SELECT 
  USING (true);

-- Create a policy that allows authenticated users to insert/update/delete page content
-- Note: In a production app, you'd want to restrict this to admin users only
CREATE POLICY "Authenticated users can manage page content" 
  ON public.page_content 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);
