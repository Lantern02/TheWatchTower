import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
const Hero = () => {
  return <section className="relative bg-gradient-to-br from-warm-50 to-warm-100 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <BookOpen className="h-16 w-16 text-warm-700 mx-auto mb-6" />
          
          <h1 className="font-serif text-4xl md:text-6xl font-semibold text-primary mb-6 leading-tight">
            TheWatchTower
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">A personal space for literary reflections, poetry, parables, prophecy, and the quiet wisdom found in everyday moments.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/blog" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-warm-800 transition-colors duration-200 font-medium">
              Explore Writings
            </Link>
            <Link to="/poetry" className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium">
              Read Poetry
            </Link>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;