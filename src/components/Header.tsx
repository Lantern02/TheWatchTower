
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, User, LogOut, Settings, Bell, Edit, Search, TrendingUp, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [penName, setPenName] = useState(localStorage.getItem('penName') || 'WordBasket');
  const [isEditingPenName, setIsEditingPenName] = useState(false);

  const { data: sections } = useQuery({
    queryKey: ['nav-sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .eq('is_active', true)
        .eq('show_in_navigation', true)
        .order('position');
      return data || [];
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePenNameChange = (newName: string) => {
    setPenName(newName);
    localStorage.setItem('penName', newName);
    setIsEditingPenName(false);
  };

  // Filter out poetry and prophecy sections
  const filteredSections = sections?.filter(section => 
    !['poetry', 'prophecy'].includes(section.slug.toLowerCase())
  ) || [];

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <span className="font-serif text-xl font-semibold text-white">
              TheWatchTower
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {filteredSections.map((section) => (
              <Link
                key={section.id}
                to={`/${section.slug}`}
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                {section.title}
              </Link>
            ))}
            <Link
              to="/trending"
              className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              About
            </Link>
            <Link
              to="/store"
              className="text-gray-300 hover:text-blue-400 transition-colors"
            >
              Store
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-10 w-64 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Write Button */}
                <Link to="/admin/posts/new">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-blue-400 hover:bg-slate-700 flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Write
                  </Button>
                </Link>

                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-gray-300 hover:text-blue-400 hover:bg-slate-700"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <User className="h-4 w-4 text-gray-300" />
                      {isEditingPenName ? (
                        <Input
                          value={penName}
                          onChange={(e) => setPenName(e.target.value)}
                          onBlur={() => handlePenNameChange(penName)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handlePenNameChange(penName);
                            }
                            if (e.key === 'Escape') {
                              setPenName(localStorage.getItem('penName') || 'WordBasket');
                              setIsEditingPenName(false);
                            }
                          }}
                          className="w-32 h-6 text-sm bg-slate-700 border-slate-600 text-white"
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="hidden sm:inline text-white hover:text-blue-400 cursor-pointer"
                          onClick={() => setIsEditingPenName(true)}
                        >
                          {penName}
                        </span>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="text-gray-300 hover:text-blue-400">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookmarks" className="text-gray-300 hover:text-blue-400">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Bookmarks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-gray-300 hover:text-blue-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden">
                <Menu className="h-4 w-4 text-gray-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
                {filteredSections.map((section) => (
                  <DropdownMenuItem key={section.id} asChild>
                    <Link to={`/${section.slug}`} className="text-gray-300 hover:text-blue-400">{section.title}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/trending" className="text-gray-300 hover:text-blue-400">Trending</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about" className="text-gray-300 hover:text-blue-400">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/store" className="text-gray-300 hover:text-blue-400">Store</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
