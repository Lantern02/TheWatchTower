
import AboutHeader from '@/components/about/AboutHeader';
import AboutBio from '@/components/about/AboutBio';
import AboutPhilosophy from '@/components/about/AboutPhilosophy';
import AboutContent from '@/components/about/AboutContent';
import ContactForm from '@/components/about/ContactForm';
import NewsletterSection from '@/components/about/NewsletterSection';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <AboutHeader />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <AboutBio />
              <AboutPhilosophy />
              <AboutContent />
              <ContactForm />
              <NewsletterSection />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
