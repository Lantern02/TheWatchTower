
import React, { useState, useEffect } from 'react';
import { FileText, Clock, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Draft {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  wordCount: number;
  status: 'draft' | 'published';
}

const DraftManager = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem('drafts');
    if (savedDrafts) {
      const parsedDrafts = JSON.parse(savedDrafts).map((draft: any) => ({
        ...draft,
        lastModified: new Date(draft.lastModified)
      }));
      setDrafts(parsedDrafts);
    }
  }, []);

  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem('drafts', JSON.stringify(updatedDrafts));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-serif font-bold text-white">Your Drafts</h2>
        </div>
        <Link to="/admin/posts/new">
          <Button className="bg-blue-500 hover:bg-blue-600">
            <Edit className="h-4 w-4 mr-2" />
            New Draft
          </Button>
        </Link>
      </div>

      {drafts.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No drafts yet</p>
            <Link to="/admin/posts/new">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Start Writing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="bg-slate-800 border-slate-700 hover:border-blue-400 transition-colors">
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/posts/${draft.id}`}>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {draft.status === 'published' && (
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-red-400"
                      onClick={() => deleteDraft(draft.id)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftManager;
