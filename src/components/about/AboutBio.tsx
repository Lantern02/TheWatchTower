
import ContentEditor from '@/components/ContentEditor';

const AboutBio = () => {
  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        My Story
      </h2>
      <ContentEditor
        page="about"
        sectionKey="main-bio"
        title="Main Bio"
        defaultContent={`Welcome to TheWatchTower, a space born from a simple belief: that in our hurried world, we need places to pause, reflect, and remember what matters most. I am a collector of quiet moments, a student of human nature, and someone who finds profound meaning in the ordinary details of daily life.

This corner of the internet serves as my watchtower—a place from which I observe the world with curiosity and wonder, then share what I see through words, poetry, prophecy, and stories. Here, you'll find reflections on books that have shaped my thinking, poems that capture fleeting moments of beauty, and visions that offer gentle wisdom for the journey we're all on.`}
        className="space-y-6"
      />
    </div>
  );
};

export default AboutBio;
