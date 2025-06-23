
import ContentEditor from '@/components/ContentEditor';

const AboutContent = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 p-8 border-2 border-orange-200 rounded-xl bg-orange-50/30">
      <div>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          What You'll Find Here
        </h3>
        <ContentEditor
          page="about"
          sectionKey="what-youll-find"
          title="What You'll Find Here"
          defaultContent={`• Personal reflections on life, literature, and meaning
• Poetry that captures fleeting moments of beauty
• Prophetic visions offering gentle wisdom
• Book recommendations that have shaped my thinking
• Thoughts on the art of slow living and mindful reading`}
          className="text-lg leading-relaxed"
        />
      </div>
      
      <div>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          My Hope for You
        </h3>
        <ContentEditor
          page="about"
          sectionKey="hope-for-you"
          title="My Hope for You"
          defaultContent="My hope is that something here resonates with you—whether it's a line of poetry that captures how you're feeling, a reflection that offers a new perspective, or simply the reminder that you're not alone in finding meaning in the small, sacred moments of everyday life."
          className="text-lg leading-relaxed"
        />
      </div>
    </div>
  );
};

export default AboutContent;
