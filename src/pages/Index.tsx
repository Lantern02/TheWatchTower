
import { BookOpen, Feather, Heart, Star, TrendingUp, Eye, Youtube, Twitter, Instagram, Facebook, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContentEditor from '@/components/ContentEditor';

const Index = () => {
  const { data: featuredBooks } = useQuery({
    queryKey: ['featured-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('book_recommendations')
        .select('*')
        .eq('featured', true)
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: recentPosts } = useQuery({
    queryKey: ['recent-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dynamic_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Feather className="h-16 w-16 text-orange-700 mx-auto mb-8" />
          <ContentEditor
            page="home"
            sectionKey="hero-title"
            title="Hero Title"
            defaultContent="<h1 class='font-serif text-5xl md:text-6xl font-semibold text-gray-900 mb-6'>TheWatchTower</h1>"
            className="mb-6"
          />
          <ContentEditor
            page="home"
            sectionKey="hero-subtitle"
            title="Hero Subtitle"
            defaultContent="<p class='text-xl text-gray-700 max-w-3xl mx-auto mb-8'>A quiet corner of the internet where words matter, stories unfold, and wisdom whispers through poetry, prophecy, and reflection.</p>"
            className="mb-8"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/blog"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
            >
              Explore Latest Posts
            </Link>
            <Link
              to="/about"
              className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg hover:bg-orange-600 hover:text-white transition-colors duration-200 font-medium"
            >
              About the Author
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content Grid */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <ContentEditor
              page="home"
              sectionKey="featured-title"
              title="Featured Section Title"
              defaultContent="<h2 class='font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-4'>Featured Content</h2>"
              className="mb-4"
            />
            <ContentEditor
              page="home"
              sectionKey="featured-description"
              title="Featured Section Description"
              defaultContent="<p class='text-gray-600 max-w-2xl mx-auto'>Discover the latest thoughts, poetry, and reflections from TheWatchTower</p>"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Poetry Section */}
            <div className="bg-orange-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <Heart className="h-10 w-10 text-orange-700 mb-6" />
              <ContentEditor
                page="home"
                sectionKey="poetry-card"
                title="Poetry Card"
                defaultContent="<h3 class='font-serif text-xl font-semibold text-gray-900 mb-4'>Poetry</h3><p class='text-gray-600 mb-6'>Verses that capture fleeting moments of beauty, love, and the sacred ordinary.</p>"
                className="mb-6"
              />
              <Link
                to="/poetry"
                className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-2"
              >
                Read Poetry <Eye className="h-4 w-4" />
              </Link>
            </div>

            {/* Blog Section */}
            <div className="bg-blue-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <BookOpen className="h-10 w-10 text-blue-700 mb-6" />
              <ContentEditor
                page="home"
                sectionKey="blog-card"
                title="Blog Card"
                defaultContent="<h3 class='font-serif text-xl font-semibold text-gray-900 mb-4'>Reflections</h3><p class='text-gray-600 mb-6'>Thoughtful essays on books, life, and the art of mindful living.</p>"
                className="mb-6"
              />
              <Link
                to="/blog"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
              >
                Read Reflections <Eye className="h-4 w-4" />
              </Link>
            </div>

            {/* Prophecy Section */}
            <div className="bg-purple-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
              <Star className="h-10 w-10 text-purple-700 mb-6" />
              <ContentEditor
                page="home"
                sectionKey="prophecy-card"
                title="Prophecy Card"
                defaultContent="<h3 class='font-serif text-xl font-semibold text-gray-900 mb-4'>Prophecy</h3><p class='text-gray-600 mb-6'>Gentle visions and wisdom for the journey ahead, offering hope and guidance.</p>"
                className="mb-6"
              />
              <Link
                to="/prophecy"
                className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2"
              >
                Read Prophecy <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ContentEditor
            page="home"
            sectionKey="social-title"
            title="Social Media Section Title"
            defaultContent="<h2 class='font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-6'>Connect With Me</h2>"
            className="mb-6"
          />
          <ContentEditor
            page="home"
            sectionKey="social-description"
            title="Social Media Section Description"
            defaultContent="<p class='text-gray-600 text-lg mb-12 max-w-2xl mx-auto'>Follow along on social media for daily inspiration, behind-the-scenes content, and community discussions.</p>"
            className="mb-12"
          />
          
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://www.youtube.com/@WordBasketForNations"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Youtube className="h-6 w-6 text-red-600 group-hover:text-red-700" />
              <span className="font-medium text-gray-900 group-hover:text-red-700">YouTube</span>
            </a>
            
            <a
              href="https://x.com/DwatcherAbove"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Twitter className="h-6 w-6 text-gray-900 group-hover:text-black" />
              <span className="font-medium text-gray-900 group-hover:text-black">X</span>
            </a>
            
            <a
              href="https://www.tiktok.com/@lightbearer012"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Music className="h-6 w-6 text-purple-600 group-hover:text-purple-700" />
              <span className="font-medium text-gray-900 group-hover:text-purple-700">TikTok</span>
            </a>
            
            <a
              href="https://www.instagram.com/the_light_bearer01/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Instagram className="h-6 w-6 text-pink-600 group-hover:text-pink-700" />
              <span className="font-medium text-gray-900 group-hover:text-pink-700">Instagram</span>
            </a>
            
            <a
              href="https://www.facebook.com/ifeatu.chuka.edozie"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Facebook className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
              <span className="font-medium text-gray-900 group-hover:text-blue-700">Facebook</span>
            </a>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts && recentPosts.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                Latest Writings
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Recent reflections and thoughts from TheWatchTower
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-2"
                  >
                    Read More <Eye className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Recommendations */}
      {featuredBooks && featuredBooks.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <ContentEditor
                page="home"
                sectionKey="books-title"
                title="Books Section Title"
                defaultContent="<h2 class='font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-4'>Recommended Reading</h2>"
                className="mb-4"
              />
              <ContentEditor
                page="home"
                sectionKey="books-description"
                title="Books Section Description"
                defaultContent="<p class='text-gray-600 max-w-2xl mx-auto'>Books that have shaped my thinking and might inspire yours</p>"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredBooks.map((book) => (
                <div key={book.id} className="text-center">
                  {book.cover_image_url && (
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-48 h-64 object-cover rounded-lg mx-auto mb-4 shadow-md"
                    />
                  )}
                  <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-3">by {book.author}</p>
                  <p className="text-gray-700 text-sm mb-4">{book.recommendation_text}</p>
                  {book.amazon_link && (
                    <a
                      href={book.amazon_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      View on Amazon
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ContentEditor
            page="home"
            sectionKey="newsletter-section"
            title="Newsletter Section"
            defaultContent="<h2 class='font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-6'>Stay Connected</h2><p class='text-gray-700 text-lg mb-8 max-w-2xl mx-auto'>Receive new writings, poetry, and reflections delivered gently to your inbox. No spam, just meaningful content when inspiration strikes.</p>"
            className="mb-8"
          />
          <Link
            to="/about#contact"
            className="bg-orange-600 text-white px-8 py-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium inline-flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
