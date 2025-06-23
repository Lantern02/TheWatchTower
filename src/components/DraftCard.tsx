
import React from 'react';
import { Clock, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Draft {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  status: 'draft' | 'published';
  sectionTitle?: string;
  sectionSlug?: string;
  slug?: string;
}

interface DraftCardProps {
  draft: Draft;
  onDelete: (id: string) => void;
}

const DraftCard = ({ draft, onDelete }: DraftCardProps) => {
  const navigate = useNavigate();

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleEdit = () => {
    navigate(`/admin/posts/${draft.id}`);
  };

  const handleView = () => {
    if (draft.sectionSlug && draft.slug) {
      navigate(`/${draft.sectionSlug}/${draft.slug}`);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-orange-400 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-serif text-white mb-2">
              {draft.title || 'Untitled Draft'}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Modified {formatTimeAgo(draft.lastModified)}</span>
              </div>
              <span>{draft.wordCount} words</span>
              <Badge 
                variant={draft.status === 'published' ? 'default' : 'secondary'}
                className={draft.status === 'published' ? 'bg-green-500' : 'bg-gray-600'}
              >
                {draft.status}
              </Badge>
              {draft.sectionTitle && (
                <Badge variant="outline" className="border-slate-600 text-gray-300">
                  {draft.sectionTitle}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-orange-400"
              onClick={handleEdit}
              title="Edit draft"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {draft.status === 'published' && draft.sectionSlug && draft.slug && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-green-400"
                onClick={handleView}
                title="View published post"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-red-400"
              onClick={() => onDelete(draft.id)}
              title="Delete draft"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 line-clamp-2">
          {draft.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>
      </CardContent>
    </Card>
  );
};

export default DraftCard;
