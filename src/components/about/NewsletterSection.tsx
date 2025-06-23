
import { BookOpen } from 'lucide-react';
import ContentEditor from '@/components/ContentEditor';

const NewsletterSection = () => {
  return (
    <div className="bg-orange-50 rounded-xl p-8 md:p-12 text-center">
      <BookOpen className="h-10 w-10 text-orange-700 mx-auto mb-6" />
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
        Join the Newsletter
      </h2>
      <ContentEditor
        page="about"
        sectionKey="newsletter"
        title="Join the Newsletter"
        defaultContent={`Receive new writings, poetry, and reflections delivered gently to your inbox. No spam, just meaningful content when inspiration strikes.

Simply check the newsletter box in the form above, or mention it in your message.`}
        className="text-center"
      />
    </div>
  );
};

export default NewsletterSection;
