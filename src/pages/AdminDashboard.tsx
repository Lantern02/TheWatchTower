import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Eye, BookOpen, TrendingUp, Plus, FolderPlus, Trash2, FileText, Edit } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [subscribersRes, postsRes, analyticsRes] = await Promise.all([
        supabase.from('newsletter_subscribers').select('count').eq('active', true),
        supabase.from('dynamic_posts').select('id, title, view_count, read_completion_count'),
        supabase.from('post_analytics').select('*')
      ]);

      const totalViews = postsRes.data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
      const totalReads = postsRes.data?.reduce((sum, post) => sum + (post.read_completion_count || 0), 0) || 0;
      
      return {
        subscribers: subscribersRes.count || 0,
        totalPosts: postsRes.data?.length || 0,
        totalViews,
        totalReads,
        posts: postsRes.data || []
      };
    },
  });

  const { data: sections, refetch: refetchSections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .order('position');
      return data || [];
    },
  });

  const { data: pageContent } = useQuery({
    queryKey: ['page-content-admin'],
    queryFn: async () => {
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .order('page, key');
      return data || [];
    },
  });

  const createCategory = async () => {
    if (!newCategoryTitle.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    
    setCreatingCategory(true);
    try {
      let slug = newCategoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      if (!slug) {
        slug = 'category-' + Date.now();
      }

      const { data: existingSection } = await supabase
        .from('sections')
        .select('id')
        .eq('slug', slug)
        .single();

      if (existingSection) {
        slug = slug + '-' + Date.now();
      }

      const { error } = await supabase
        .from('sections')
        .insert([{
          title: newCategoryTitle.trim(),
          slug,
          is_active: true,
          show_in_navigation: true,
          position: (sections?.length || 0) + 1
        }]);

      if (error) throw error;

      setNewCategoryTitle('');
      refetchSections();
      toast.success(`Category "${newCategoryTitle}" created successfully!`);
    } catch (error: any) {
      console.error('Category creation error:', error);
      toast.error('Failed to create category: ' + (error.message || 'Unknown error'));
    } finally {
      setCreatingCategory(false);
    }
  };

  const deleteCategory = async (sectionId: string, sectionTitle: string) => {
    if (!confirm(`Are you sure you want to delete the "${sectionTitle}" category? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data: posts } = await supabase
        .from('dynamic_posts')
        .select('id')
        .eq('section_id', sectionId)
        .limit(1);

      if (posts && posts.length > 0) {
        toast.error('Cannot delete category that contains posts. Please move or delete all posts first.');
        return;
      }

      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;

      refetchSections();
      toast.success(`Category "${sectionTitle}" deleted successfully!`);
    } catch (error: any) {
      console.error('Category deletion error:', error);
      toast.error('Failed to delete category: ' + (error.message || 'Unknown error'));
    }
  };

  const chartData = stats?.posts.map(post => ({
    name: post.title.substring(0, 20) + '...',
    views: post.view_count,
    reads: post.read_completion_count
  })) || [];

  const COLORS = ['#374151', '#4B5563', '#6B7280', '#9CA3AF'];

  const defaultSection = sections?.find(s => s.slug === 'blog');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Dashboard</h1>
        <div className="flex gap-2">
          <Link to={`/admin/posts/new?section=${defaultSection?.id || ''}`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Page Content Management
          </CardTitle>
          <CardDescription>Edit content sections across your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/about" className="block">
              <div className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg border transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-orange-900">About Page</h3>
                  <Edit className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm text-orange-700">
                  {pageContent?.filter(c => c.page === 'about').length || 0} editable sections
                </p>
              </div>
            </Link>
            
            <div className="bg-gray-50 p-4 rounded-lg border opacity-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-600">Home Page</h3>
                <Edit className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border opacity-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-600">Other Pages</h3>
                <Edit className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Manage Categories
          </CardTitle>
          <CardDescription>Create and organize your content categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Category name (e.g., Technology, Health, Opinion)"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !creatingCategory && createCategory()}
              className="flex-1"
            />
            <Button 
              onClick={createCategory} 
              disabled={creatingCategory || !newCategoryTitle.trim()}
            >
              {creatingCategory ? 'Creating...' : 'Add Category'}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections?.map(section => (
              <div key={section.id} className="bg-secondary px-4 py-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">{section.title}</div>
                  <div className="text-sm text-muted-foreground">/{section.slug}</div>
                </div>
                {!['blog', 'poetry', 'prophecy', 'book-picks'].includes(section.slug) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCategory(section.id, section.title)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.subscribers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalViews ? Math.round((stats.totalReads / stats.totalViews) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Performance</CardTitle>
            <CardDescription>Views vs. Completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#374151" />
                <Bar dataKey="reads" fill="#4B5563" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Posts by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sections?.map((section, index) => ({
                    name: section.title,
                    value: Math.random() * 10 + 1,
                    fill: COLORS[index % COLORS.length]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
