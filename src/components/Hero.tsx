
import { BookOpen, Feather, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-amber-400 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-amber-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-amber-400 rounded-full"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in">
          {/* Icon cluster */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <BookOpen className="h-12 w-12 text-amber-700" />
            <Feather className="h-10 w-10 text-amber-600" />
            <Eye className="h-11 w-11 text-amber-700" />
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            The<span className="text-amber-700">Watch</span>Tower
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto font-light">
            A sanctuary for contemplative souls seeking wisdom through words, poetry, prophecy, and the sacred art of slow reflection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link 
              to="/blog" 
              className="group bg-primary text-primary-foreground px-10 py-4 rounded-xl hover:bg-amber-800 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Begin Reading
                <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
            <Link 
              to="/poetry" 
              className="group border-2 border-primary text-primary px-10 py-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                Explore Poetry
                <Feather className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground italic max-w-2xl mx-auto">
            "In the quiet spaces between words, wisdom makes its home."
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
