
import { BookOpen, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-orange-50 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-orange-700" />
              <span className="font-serif text-lg font-semibold text-gray-900">
                TheWatchTower
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              A personal space for literary reflections, poetry, and wisdom gathered along the journey.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-gray-900">Explore</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/blog" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                Blog
              </Link>
              <Link to="/poetry" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                Poetry
              </Link>
              <Link to="/parables" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                Parables
              </Link>
              <Link to="/book-picks" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                Book Picks
              </Link>
              <Link to="/about" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                About
              </Link>
              <Link to="/store" className="text-sm text-gray-600 hover:text-orange-700 transition-colors">
                Store
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-gray-900">Stay Connected</h3>
            <p className="text-sm text-gray-600">
              Subscribe to receive new writings and reflections.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center space-x-2 text-sm text-orange-700 hover:text-orange-800 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>Subscribe to Newsletter</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-orange-200">
          <p className="text-center text-sm text-gray-500">
            © 2024 TheWatchTower. A space for contemplation and literary reflection.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
