
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, User, LogOut, Settings, Bell, Edit, TrendingUp, Bookmark, FileText, Camera } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import SearchBar from './SearchBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [penName, setPenName] = useState(localStorage.getItem('penName') || 'Anonymous Writer');
  const [isEditingPenName, setIsEditingPenName] = useState(false);
  const [tempPenName, setTempPenName] = useState(penName);

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

  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePenNameSave = () => {
    const finalName = tempPenName.trim() || 'Anonymous Writer';
    setPenName(finalName);
    localStorage.setItem('penName', finalName);
    setIsEditingPenName(false);
  };

  const handlePenNameCancel = () => {
    setTempPenName(penName);
    setIsEditingPenName(false);
  };

  // Filter out poetry and prophecy sections
  const filteredSections = sections?.filter(section => 
    !['poetry', 'prophecy'].includes(section.slug.toLowerCase())
  ) || [];

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
            <BookOpen className="h-8 w-8 text-blue-400" />
            <span className="font-serif text-xl font-semibold text-white">
              TheWatchTower
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center mx-8">
            {filteredSections.map((section) => (
              <Link
                key={section.id}
                to={`/${section.slug}`}
                className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
              >
                {section.title}
              </Link>
            ))}
            <Link
              to="/trending"
              className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-1 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/store"
              className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
            >
              Store
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center relative flex-shrink-0 mx-8">
            <SearchBar />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Write Button */}
                <Link to="/admin/posts/new">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-blue-400 hover:bg-slate-700 flex items-center gap-2"
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
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ''} alt={penName} />
                        <AvatarFallback className="bg-slate-700 text-white">
                          {penName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-white font-medium min-w-0">
                        {penName}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 z-50">
                    <Dialog open={isEditingPenName} onOpenChange={setIsEditingPenName}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Pen Name
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Edit Your Pen Name</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={tempPenName}
                            onChange={(e) => setTempPenName(e.target.value)}
                            placeholder="Enter your pen name"
                            className="bg-slate-700 border-slate-600 text-white"
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={handlePenNameCancel}
                              className="border-slate-600 text-white hover:bg-slate-700"
                            >
                              Cancel
                            </Button>
                            <Button onClick={handlePenNameSave} className="bg-blue-600 hover:bg-blue-700">
                              Save
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="text-gray-300 hover:text-blue-400">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="text-gray-300 hover:text-blue-400">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/drafts" className="text-gray-300 hover:text-blue-400">
                        <FileText className="mr-2 h-4 w-4" />
                        My Drafts
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
              <DropdownMenuTrigger className="lg:hidden">
                <Menu className="h-5 w-5 text-gray-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700 z-50">
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
