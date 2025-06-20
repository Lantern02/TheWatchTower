
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedContent = () => {
  // Easy to change images - just update these URLs
  const images = {
    blog: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop',
    poetry: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    prophecy: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
  };

  const featuredPosts = [
    {
      category: 'Blog',
      title: 'On the Art of Slow Reading',
      excerpt: 'In our rushed world, there\'s profound wisdom in savoring each word, each pause, each carefully crafted sentence...',
      link: '/blog',
      image: images.blog
    },
    {
      category: 'Poetry',
      title: 'Morning Light',
      excerpt: 'Through amber glass / the morning spills its gold / across forgotten dreams...',
      link: '/poetry',
      image: images.poetry
    },
    {
      category: 'Prophecy',
      title: 'Visions of Tomorrow',
      excerpt: 'In the stillness of dawn, glimpses of what is to come whisper through the veil of time...',
      link: '/prophecy',
      image: images.prophecy
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
            Recent Reflections
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            New writings, poetry, and contemplations from the watchtower of daily life.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {featuredPosts.map((post, index) => (
            <article 
              key={index} 
              className="group cursor-pointer animate-fade-in hover:transform hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Link to={post.link}>
                <div className="overflow-hidden rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-4">
                  <span className="text-sm font-semibold text-orange-700 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-gray-900 group-hover:text-orange-700 transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContent;
