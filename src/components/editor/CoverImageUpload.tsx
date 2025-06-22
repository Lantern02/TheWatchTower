
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';

interface CoverImageUploadProps {
  coverImage: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoverImageUpload = ({ coverImage, onImageUpload }: CoverImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
        onChange={onImageUpload} 
        className="hidden" 
      />
    </div>
  );
};

export default CoverImageUpload;
