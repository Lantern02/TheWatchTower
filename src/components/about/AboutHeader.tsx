
import { User } from 'lucide-react';
import ContentEditor from '@/components/ContentEditor';

const AboutHeader = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <User className="h-12 w-12 text-orange-700 mx-auto mb-6" />
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          About Me
        </h1>
        <ContentEditor
          page="about"
          sectionKey="header"
          title="Header Description"
          defaultContent="A keeper of words, a seeker of quiet wisdom, and a believer in the power of stories to transform hearts."
          className="text-center"
        />
      </div>
    </section>
  );
};

export default AboutHeader;
