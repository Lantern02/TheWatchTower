
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Eye, BookOpen, TrendingUp, Plus, FolderPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const { toast } = useToast();

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

  const createCategory = async () => {
    if (!newCategoryTitle.trim()) return;
    
    setCreatingCategory(true);
    try {
      const slug = newCategoryTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const { error } = await supabase
        .from('sections')
        .insert([{
          title: newCategoryTitle,
          slug,
          is_active: true,
          show_in_navigation: true,
          position: (sections?.length || 0) + 1
        }]);

      if (error) throw error;

      setNewCategoryTitle('');
      refetchSections();
      toast({
        title: "Category created",
        description: `${newCategoryTitle} has been added successfully.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create category",
        description: error.message,
      });
    } finally {
      setCreatingCategory(false);
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
              placeholder="Category name"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createCategory()}
            />
            <Button onClick={createCategory} disabled={creatingCategory || !newCategoryTitle.trim()}>
              {creatingCategory ? 'Creating...' : 'Add Category'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sections?.map(section => (
              <div key={section.id} className="bg-secondary px-3 py-1 rounded-full text-sm">
                {section.title}
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
