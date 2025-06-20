
import React, { useState } from 'react';
import { MessageCircle, Reply, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
}

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'Great article! Really insightful perspective on this topic.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 5,
      replies: [
        {
          id: '2',
          author: 'Jane Smith',
          content: 'I completely agree! The examples provided really helped clarify the concepts.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          likes: 2,
          replies: []
        }
      ]
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const addComment = () => {
    if (!newComment.trim() || !isAuthenticated) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: localStorage.getItem('penName') || 'Anonymous',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const addReply = (parentId: string) => {
    if (!replyContent.trim() || !isAuthenticated) return;

    const reply: Comment = {
      id: Date.now().toString(),
      author: localStorage.getItem('penName') || 'Anonymous',
      content: replyContent,
      timestamp: new Date(),
      likes: 0,
      replies: []
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));
    
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <Card className={`bg-slate-800 border-slate-700 ${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-slate-600 text-white text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-white">{comment.author}</span>
              <span className="text-sm text-gray-400">{formatTimeAgo(comment.timestamp)}</span>
            </div>
            
            <p className="text-gray-300 mb-3">{comment.content}</p>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-0">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {comment.likes}
              </Button>
              
              {!isReply && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-blue-400 p-0"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => addReply(comment.id)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Reply
                  </Button>
                  <Button 
                    onClick={() => setReplyingTo(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {comment.replies.map(reply => (
          <CommentItem key={reply.id} comment={reply} isReply={true} />
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-blue-400" />
        <h3 className="text-xl font-semibold text-white">
          Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
        </h3>
      </div>

      {isAuthenticated ? (
        <div className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 min-h-[100px] mb-3"
          />
          <Button 
            onClick={addComment}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Post Comment
          </Button>
        </div>
      ) : (
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 mb-3">Sign in to join the conversation</p>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
