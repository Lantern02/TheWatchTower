
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditorMetadataProps {
  category: string;
  setCategory: (category: string) => void;
  excerpt: string;
  setExcerpt: (excerpt: string) => void;
  sections: any[] | undefined;
}

const EditorMetadata = ({
  category,
  setCategory,
  excerpt,
  setExcerpt,
  sections
}: EditorMetadataProps) => {
  return (
    <>
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full max-w-xs bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {sections?.map((section) => (
              <SelectItem key={section.id} value={section.id}>
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
          dir="ltr"
        />
      </div>
    </>
  );
};

export default EditorMetadata;
