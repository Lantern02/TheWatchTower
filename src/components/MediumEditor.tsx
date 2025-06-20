
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save, Eye, EyeOff, Image as ImageIcon, Type, Bold, Italic, List, AlignLeft, Underline, Link } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ReadingProgress from './ReadingProgress';
import { Toggle } from '@/components/ui/toggle';

interface MediumEditorProps {
  postId?: string;
  sectionId: string;
  initialTitle?: string;
  initialContent?: any;
  initialCoverImage?: string;
  onPublish?: (published: boolean) => void;
}

const MediumEditor = ({
  postId,
  sectionId,
  initialTitle = '',
  initialContent = {},
  initialCoverImage = '',
  onPublish
}: MediumEditorProps) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    saving,
    lastSaved,
    save
  } = useAutoSave({
    postId,
    sectionId,
    initialTitle,
    initialContent
  });

  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [isPublished, setIsPublished] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch sections from dashboard
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('is_active', true)
        .order('position');
      return data || [];
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML;
      setContent({
        html: htmlContent,
        category: category
      });
    }
  };

  const togglePublish = async () => {
    const newPublishState = !isPublished;
    setIsPublished(newPublishState);
    onPublish?.(newPublishState);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
    handleContentChange();
    
    // Update active formats
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    
    setActiveFormats(formats);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      formatText('createLink', url);
    }
  };

  // Calculate word count
  const wordCount = content.html ? content.html.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length : 0;

  // Focus the editor when component mounts
  useEffect(() => {
    if (contentRef.current && !content.html) {
      contentRef.current.focus();
    }
  }, []);

  // Update active formats when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveFormats();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      Saving...
                    </span>
                  ) : lastSaved ? (
                    `Saved ${lastSaved.toLocaleTimeString()}`
                  ) : (
                    'Draft'
                  )}
                </span>
                <span className="text-sm text-gray-500">
                  {wordCount} words
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={save} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant={isPublished ? "default" : "outline"} 
                size="sm" 
                onClick={togglePublish}
                className={isPublished ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isPublished ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {isPublished ? 'Published' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Reading Progress */}
        {content.html && <ReadingProgress content={content.html} />}

        <Card className="bg-white shadow-sm border-gray-200">
          <div className="p-8">
            {/* Cover Image */}
            <div className="mb-8">
              {coverImage ? (
                <div className="relative group">
                  <img 
                    src={coverImage} 
                    alt="Cover" 
                    className="w-full h-80 object-cover rounded-lg border border-gray-200" 
                  />
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Change
                  </Button>
                </div>
              ) : (
                <div 
                  className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-gray-25" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Add a cover image</p>
                    <p className="text-gray-400 text-sm">Click to upload</p>
                  </div>
                </div>
              )}
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </div>

            {/* Title */}
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Your story title..." 
              className="text-4xl font-bold border-none p-0 mb-6 placeholder:text-gray-400 focus:ring-0 focus:outline-none bg-transparent resize-none h-auto min-h-[60px] text-gray-900" 
            />

            {/* Category Selection - Connected to Dashboard */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full max-w-xs bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {sections?.map((section) => (
                    <SelectItem key={section.id} value={section.slug}>
                      {section.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Brief description)
              </label>
              <Input 
                value={excerpt} 
                onChange={e => setExcerpt(e.target.value)} 
                placeholder="What's your story about?" 
                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              />
            </div>

            {/* Enhanced Formatting Toolbar with Toggle States */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
              <div className="flex items-center gap-1 flex-wrap">
                <Toggle
                  pressed={activeFormats.has('bold')}
                  onPressedChange={() => formatText('bold')}
                  className="hover:bg-gray-200"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={activeFormats.has('italic')}
                  onPressedChange={() => formatText('italic')}
                  className="hover:bg-gray-200"
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={activeFormats.has('underline')}
                  onPressedChange={() => formatText('underline')}
                  className="hover:bg-gray-200"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('formatBlock', 'h2')}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  title="Heading 2"
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('formatBlock', 'h3')}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300 text-xs font-medium px-2"
                  title="Heading 3"
                >
                  H3
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('insertUnorderedList')}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('insertOrderedList')}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300 text-xs font-medium px-2"
                  title="Numbered List"
                >
                  1.
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={insertLink}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  title="Insert Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('justifyLeft')}
                  className="hover:bg-gray-200 border border-transparent hover:border-gray-300"
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Editor with proper LTR direction */}
            <div className="relative">
              <div 
                ref={contentRef} 
                contentEditable 
                suppressContentEditableWarning={true}
                className="min-h-96 prose prose-lg max-w-none focus:outline-none text-gray-900 border-2 border-gray-300 rounded-lg p-6 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                onInput={handleContentChange}
                onPaste={(e) => {
                  // Handle paste to maintain proper formatting
                  e.preventDefault();
                  const text = e.clipboardData.getData('text/plain');
                  document.execCommand('insertText', false, text);
                }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.7',
                  letterSpacing: '-0.003em',
                  direction: 'ltr',
                  textAlign: 'left',
                  unicodeBidi: 'normal'
                }}
                dangerouslySetInnerHTML={{
                  __html: content.html || ''
                }}
                dir="ltr"
              />
              
              {(!content.html || content.html === '') && (
                <div className="absolute top-6 left-6 pointer-events-none text-gray-400 text-lg">
                  Start writing your story...
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MediumEditor;
