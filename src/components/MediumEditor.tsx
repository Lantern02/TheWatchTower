
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Save, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useAutoSave } from '@/hooks/useAutoSave';

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
  } = useAutoSave({ postId, sectionId, initialTitle, initialContent });

  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [isPublished, setIsPublished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const htmlContent = contentRef.current.innerHTML;
      setContent({ html: htmlContent });
    }
  };

  const togglePublish = async () => {
    const newPublishState = !isPublished;
    setIsPublished(newPublishState);
    onPublish?.(newPublishState);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={save}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant={isPublished ? "default" : "outline"}
            size="sm"
            onClick={togglePublish}
          >
            {isPublished ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {isPublished ? 'Published' : 'Publish'}
          </Button>
        </div>
      </div>

      <Card className="p-8">
        {/* Cover Image */}
        <div className="mb-8">
          {coverImage ? (
            <div className="relative">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>
          ) : (
            <div
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Click to add a cover image</p>
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="text-4xl font-serif border-none p-0 mb-8 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
        />

        {/* Content Editor */}
        <div
          ref={contentRef}
          contentEditable
          className="min-h-96 prose prose-lg max-w-none focus:outline-none"
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content.html || '' }}
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#374151'
          }}
        />
        
        {contentRef.current?.innerHTML === '' && (
          <p className="text-gray-400 text-lg mt-4 pointer-events-none">
            Tell your story...
          </p>
        )}
      </Card>
    </div>
  );
};

export default MediumEditor;
