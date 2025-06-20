
import React, { useState } from 'react';
import { Heart, ThumbsUp, ThumbsDown, MessageCircle, Share, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReactionsBarProps {
  postId: string;
  initialClaps?: number;
  initialLikes?: number;
  initialDislikes?: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: (bookmarked: boolean) => void;
}

const ReactionsBar = ({ 
  postId, 
  initialClaps = 0, 
  initialLikes = 0, 
  initialDislikes = 0,
  isBookmarked = false,
  onBookmarkToggle 
}: ReactionsBarProps) => {
  const [claps, setClaps] = useState(initialClaps);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userClapped, setUserClapped] = useState(false);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleClap = () => {
    if (!userClapped) {
      setClaps(prev => prev + 1);
      setUserClapped(true);
      toast.success('👏 Thanks for the clap!');
    }
  };

  const handleLike = () => {
    if (userDisliked) {
      setDislikes(prev => prev - 1);
      setUserDisliked(false);
    }
    if (!userLiked) {
      setLikes(prev => prev + 1);
      setUserLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setUserLiked(false);
    }
  };

  const handleDislike = () => {
    if (userLiked) {
      setLikes(prev => prev - 1);
      setUserLiked(false);
    }
    if (!userDisliked) {
      setDislikes(prev => prev + 1);
      setUserDisliked(true);
    } else {
      setDislikes(prev => prev - 1);
      setUserDisliked(false);
    }
  };

  const handleBookmark = () => {
    const newBookmarkedState = !bookmarked;
    setBookmarked(newBookmarkedState);
    
    // Update localStorage bookmarks
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    if (newBookmarkedState) {
      if (!bookmarks.includes(postId)) {
        bookmarks.push(postId);
        toast.success('Article bookmarked!');
      }
    } else {
      const index = bookmarks.indexOf(postId);
      if (index > -1) {
        bookmarks.splice(index, 1);
        toast.success('Bookmark removed');
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    onBookmarkToggle?.(newBookmarkedState);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this article',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-t border-slate-700">
      {/* Claps */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClap}
        className={`flex items-center gap-2 ${
          userClapped ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'
        }`}
      >
        <Heart className={`h-4 w-4 ${userClapped ? 'fill-current' : ''}`} />
        <span>{claps}</span>
      </Button>

      {/* Likes */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex items-center gap-2 ${
          userLiked ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-green-400'
        }`}
      >
        <ThumbsUp className={`h-4 w-4 ${userLiked ? 'fill-current' : ''}`} />
        <span>{likes}</span>
      </Button>

      {/* Dislikes */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        className={`flex items-center gap-2 ${
          userDisliked ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'
        }`}
      >
        <ThumbsDown className={`h-4 w-4 ${userDisliked ? 'fill-current' : ''}`} />
        <span>{dislikes}</span>
      </Button>

      {/* Comments */}
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
      >
        <MessageCircle className="h-4 w-4" />
        <span>Comment</span>
      </Button>

      {/* Bookmark */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`flex items-center gap-2 ${
          bookmarked ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'
        }`}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      </Button>

      {/* Share */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-400"
      >
        <Share className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ReactionsBar;
