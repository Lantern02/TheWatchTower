
import ContentEditor from '@/components/ContentEditor';

const AboutPhilosophy = () => {
  return (
    <div className="bg-orange-50 rounded-xl p-8 md:p-12">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        My Writing Philosophy
      </h2>
      <ContentEditor
        page="about"
        sectionKey="philosophy"
        title="My Writing Philosophy"
        defaultContent={`I believe that the best writing doesn't shout—it whispers. It doesn't demand attention—it earns it through honesty, beauty, and the recognition of shared humanity. Whether I'm crafting a poem about morning light or sharing thoughts about a book that moved me, my goal is always the same: to create moments of connection and understanding.

In a world full of noise, I choose to write from the quiet spaces—those in-between moments where wisdom often lives. I'm drawn to the power of simplicity, the beauty of restraint, and the profound impact of carefully chosen words.`}
      />
    </div>
  );
};

export default AboutPhilosophy;
