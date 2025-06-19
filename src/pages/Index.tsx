
import Hero from '@/components/Hero';
import FeaturedContent from '@/components/FeaturedContent';
import NewsletterSignup from '@/components/NewsletterSignup';
import NewsletterPopup from '@/components/NewsletterPopup';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedContent />
      <NewsletterSignup />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
