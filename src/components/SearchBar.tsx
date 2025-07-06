
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ className = "" }: { className?: string }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles, topics..."
        className="pl-10 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <Button 
        type="submit" 
        size="sm" 
        className="absolute right-1 top-1/2 transform -translate-y-1/2"
        disabled={!query.trim()}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
