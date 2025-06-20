
import React, { useState } from 'react';
import { Tag, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TagsManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagsManager = ({ tags, onTagsChange, placeholder = "Add tags..." }: TagsManagerProps) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      onTagsChange([...tags, newTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Tags</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-blue-500/20 text-blue-300 border-blue-400/30 flex items-center gap-1"
          >
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-blue-400/20"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
        />
        <Button
          onClick={addTag}
          variant="outline"
          size="sm"
          className="border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TagsManager;
