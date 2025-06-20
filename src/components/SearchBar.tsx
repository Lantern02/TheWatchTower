
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SearchResults from './SearchResults';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowResults(newQuery.trim().length > 0);
  };

  const handleInputFocus = () => {
    if (query.trim().length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search articles, topics, authors..."
        className="pl-10 w-96 bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
      />
      {showResults && (
        <SearchResults 
          query={query} 
          onClose={() => setShowResults(false)} 
        />
      )}
    </div>
  );
};

export default SearchBar;
