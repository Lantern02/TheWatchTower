
import { Eye } from 'lucide-react';

const Prophecy = () => {
  const prophecies = [
    {
      title: 'The Age of Awakening',
      date: 'December 16, 2024',
      content: `I see a time approaching when the noise of the world will crescendo to such intensity that souls will flee to silence as refugees to sanctuary.

In this great turning, the seekers will find each other not through networks of connection, but through the quality of their stillness. They will recognize one another by the depth of their listening, the gentleness of their presence.

Cities will pulse with frantic energy while small gatherings bloom in quiet corners—gardens where wisdom is cultivated like rare flowers, tended by those who understand that the future belongs not to the loudest voices, but to the most attentive hearts.

The digital streams will rage like rivers in flood, but the wise will learn to drink from deeper wells.`,
      vision: 'A future where authentic connection emerges from shared silence rather than shared noise.'
    },
    {
      title: 'The Return to Story',
      date: 'December 11, 2024',
      content: `There comes a season when humanity will hunger for stories the way the desert thirsts for rain.

Not the quick narratives that flash and fade, but the deep tales that take root in the soul and grow slowly into wisdom. I see libraries becoming temples again, and storytellers taking their place beside teachers as shapers of the future.

The children born in this time will know intuitively what their parents forgot: that a single story, told with love and received with open hearts, can heal what seems beyond repair.

Books will be treasured not as objects, but as portals. Reading will become a sacred act, practiced in communities of the spirit.`,
      vision: 'Stories will once again become the bridges between souls, carrying wisdom across the chasms of modern disconnection.'
    },
    {
      title: 'The Gentle Revolution',
      date: 'December 6, 2024',
      content: `I witness a revolution that moves like morning mist, transforming everything it touches without force or fanfare.

It begins with individuals who choose presence over productivity, depth over speed, quality over quantity. They plant seeds of contemplation in concrete worlds, and watch as cracks appear where flowers will eventually grow.

This revolution has no leaders because it needs none—it spreads through example, through the contagion of peace, through the radical act of slowing down in a world that demands acceleration.

The warriors of this movement carry no weapons but attention, no shields but compassion. Their victory is measured not in territory conquered, but in hearts opened.`,
      vision: 'Change will come not through force, but through the irresistible power of lived wisdom and gentle example.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <Eye className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Prophecy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Visions and glimpses of what may come, seen through the lens of hope and the wisdom of the ages.
          </p>
        </div>
      </section>

      {/* Prophecies */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto space-y-16">
          {prophecies.map((prophecy, index) => (
            <article 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card border border-warm-200 rounded-xl p-8 md:p-12">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary">
                      {prophecy.title}
                    </h2>
                    <time className="text-sm text-muted-foreground">{prophecy.date}</time>
                  </div>
                  
                  <div className="prose-custom text-lg leading-relaxed">
                    <p className="whitespace-pre-line">{prophecy.content}</p>
                  </div>
                  
                  <div className="border-t border-warm-200 pt-6">
                    <p className="text-muted-foreground italic text-center leading-relaxed">
                      {prophecy.vision}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Prophecy;
