
import React, { useState, useEffect } from 'react';
import { Clock, Eye, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  content: string;
  onProgressChange?: (progress: number) => void;
}

const ReadingProgress = ({ content, onProgressChange }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReading, setIsReading] = useState(false);

  // Calculate reading time (average 200 words per minute)
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const estimatedReadTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      setProgress(Math.min(100, Math.max(0, scrolled)));
      onProgressChange?.(scrolled);
      
      if (scrolled > 10 && !isReading) {
        setIsReading(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReading, onProgressChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isReading) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReading]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Fixed Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-blue-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reading Stats */}
      <div className="flex items-center gap-6 text-sm text-gray-400 mb-6 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{estimatedReadTime} min read</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>Time spent: {formatTime(timeSpent)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Progress Bar in Content */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Reading Progress</span>
          <span className="text-sm text-blue-400">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </>
  );
};

export default ReadingProgress;
