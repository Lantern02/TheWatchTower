import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Save, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';
import TagsManager from './TagsManager';
import ReadingProgress from './ReadingProgress';
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
  const [tags, setTags] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        html: htmlContent
      });
    }
  };
  const togglePublish = async () => {
    const newPublishState = !isPublished;
    setIsPublished(newPublishState);
    onPublish?.(newPublishState);
  };

  // Calculate word count
  const wordCount = content.html ? content.html.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  return <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Draft'}
              </span>
              <span className="text-sm text-muted-foreground">
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={save} className="bg-gray-900 hover:bg-gray-800">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant={isPublished ? "default" : "outline"} size="sm" onClick={togglePublish} className="bg-gray-900 hover:bg-gray-800">
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

        {/* Cover Image */}
        <div className="mb-8">
          {coverImage ? <div className="relative group">
              <img src={coverImage} alt="Cover" className="w-full h-80 object-cover rounded-lg" />
              <Button variant="secondary" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div> : <div className="w-full h-80 border border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <div className="text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Add a cover image</p>
              </div>
            </div>}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Title */}
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="text-5xl font-serif border-none p-0 mb-8 placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none bg-transparent resize-none h-auto min-h-[60px]" />

        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Excerpt (Optional)
          </label>
          <Input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief description of your article..." className="bg-slate-700 border-slate-600 text-white placeholder-gray-400" />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <TagsManager tags={tags} onTagsChange={setTags} placeholder="Add tags to help readers find your article..." />
        </div>

        {/* Content Editor */}
        <div ref={contentRef} contentEditable className="min-h-96 prose prose-lg max-w-none focus:outline-none text-foreground" onInput={handleContentChange} dangerouslySetInnerHTML={{
        __html: content.html || ''
      }} style={{
        fontSize: '21px',
        lineHeight: '1.58',
        letterSpacing: '-0.003em'
      }} />
        
        {(!content.html || content.html === '') && <p className="text-muted-foreground/50 text-xl mt-4 pointer-events-none">
            Tell your story...
          </p>}
      </div>
    </div>;
};
export default MediumEditor;