
import { BookOpen } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      title: 'On the Art of Slow Reading',
      date: 'December 15, 2024',
      excerpt: 'In our rushed world, there\'s profound wisdom in savoring each word, each pause, each carefully crafted sentence. When we slow down, we discover that reading becomes meditation.',
      content: 'Full post content would go here...',
      readTime: '5 min read'
    },
    {
      title: 'Finding Silence in a Noisy World',
      date: 'December 10, 2024',
      excerpt: 'True silence isn\'t the absence of sound, but the presence of peace. It\'s in those quiet moments that we hear the whispers of wisdom.',
      content: 'Full post content would go here...',
      readTime: '7 min read'
    },
    {
      title: 'The Weight of Words',
      date: 'December 5, 2024',
      excerpt: 'Every word carries weight, every sentence shapes reality. As writers and readers, we are architects of meaning, builders of bridges between souls.',
      content: 'Full post content would go here...',
      readTime: '6 min read'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <BookOpen className="h-12 w-12 text-orange-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reflections on life, literature, and the spaces between words where meaning lives.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {blogPosts.map((post, index) => (
            <article 
              key={index} 
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="border-b border-orange-200 pb-8 hover:border-orange-300 transition-colors">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-4 group-hover:text-orange-700 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-lg mb-6 leading-relaxed text-gray-700">
                  {post.excerpt}
                </p>
                
                <span className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                  Read more →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
