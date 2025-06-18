
import { BookOpen } from 'lucide-react';

const BookPicks = () => {
  const bookPicks = [
    {
      title: 'The Book of Joy',
      author: 'Dalai Lama & Desmond Tutu',
      category: 'Wisdom',
      description: 'A luminous conversation between two spiritual giants about finding joy in the face of suffering. Their friendship and insights remind us that joy is not the absence of hardship, but the presence of perspective.',
      why: 'This book teaches us that joy can be cultivated like a garden—with patience, practice, and the recognition that our deepest happiness often grows from our capacity to serve others.',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop'
    },
    {
      title: 'The Overstory',
      author: 'Richard Powers',
      category: 'Fiction',
      description: 'A breathtaking novel that weaves together the lives of trees and humans, revealing the interconnectedness of all life. Powers writes with the patience of forests and the urgency of environmental crisis.',
      why: 'This book changed how I see the world around me. It\'s a reminder that we are part of a larger story, one that began long before us and will continue long after we\'re gone.',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'
    },
    {
      title: 'Letters to a Young Poet',
      author: 'Rainer Maria Rilke',
      category: 'Writing',
      description: 'Rilke\'s tender guidance to a young poet seeking advice about art, love, and life. These letters are filled with wisdom about solitude, creativity, and the courage to live authentically.',
      why: 'Whether you write or not, Rilke\'s insights about living deeply and embracing uncertainty speak to anyone seeking a more meaningful existence.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
    },
    {
      title: 'The Wisdom of Insecurity',
      author: 'Alan Watts',
      category: 'Philosophy',
      description: 'Watts explores the anxiety that comes from trying to find security in an inherently insecure world, offering instead a path toward embracing uncertainty as the foundation of a fulfilling life.',
      why: 'In our culture of constant planning and control, Watts offers the radical idea that true peace comes from dancing with uncertainty rather than fighting against it.',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <BookOpen className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Book Picks
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Books that have shaped my thinking, touched my heart, and opened new ways of seeing the world.
          </p>
        </div>
      </section>

      {/* Books */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto space-y-12">
          {bookPicks.map((book, index) => (
            <article 
              key={index} 
              className="bg-card border border-warm-200 rounded-xl overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="md:flex">
                <div className="md:w-48 md:flex-shrink-0">
                  <img 
                    src={book.image} 
                    alt={`${book.title} cover`}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                
                <div className="p-8 md:p-12 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-warm-700 uppercase tracking-wide">
                        {book.category}
                      </span>
                    </div>
                    
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary">
                      {book.title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground">
                      by {book.author}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="prose-custom leading-relaxed">
                      {book.description}
                    </p>
                    
                    <div className="border-l-4 border-warm-300 pl-6">
                      <p className="prose-custom italic">
                        <strong className="text-primary">Why I recommend it:</strong> {book.why}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BookPicks;
