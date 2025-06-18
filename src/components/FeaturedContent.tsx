
import { BookOpen, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedContent = () => {
  const featuredPosts = [
    {
      category: 'Blog',
      title: 'On the Art of Slow Reading',
      excerpt: 'In our rushed world, there\'s profound wisdom in savoring each word, each pause, each carefully crafted sentence...',
      link: '/blog',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop'
    },
    {
      category: 'Poetry',
      title: 'Morning Light',
      excerpt: 'Through amber glass / the morning spills its gold / across forgotten dreams...',
      link: '/poetry',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'
    },
    {
      category: 'Parable',
      title: 'The Garden Keeper',
      excerpt: 'There once was a keeper who tended not flowers, but the spaces between them...',
      link: '/parables',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop'
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-4">
            Recent Reflections
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            New writings, poetry, and contemplations from the watchtower of daily life.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {featuredPosts.map((post, index) => (
            <article 
              key={index} 
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Link to={post.link}>
                <div className="overflow-hidden rounded-lg mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-sm font-medium text-warm-700 uppercase tracking-wide">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-primary group-hover:text-warm-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-warm-50 rounded-xl p-8 md:p-12 text-center animate-fade-in">
          <Mail className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-4">
            Join the Conversation
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to receive new writings, poetry, and reflections delivered to your inbox. 
            A gentle companion for your own contemplative journey.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-warm-800 transition-colors duration-200 font-medium"
          >
            <Mail className="h-5 w-5" />
            <span>Subscribe to Newsletter</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
