
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <BookOpen className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Reflections on life, literature, and the spaces between words where meaning lives.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto space-y-12">
          {blogPosts.map((post, index) => (
            <article 
              key={index} 
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="border-b border-warm-200 pb-8 hover:border-warm-300 transition-colors">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <time>{post.date}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-4 group-hover:text-warm-700 transition-colors">
                  {post.title}
                </h2>
                
                <p className="prose-custom text-lg mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <span className="text-primary font-medium hover:text-warm-700 transition-colors">
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
