
import { BookOpen } from 'lucide-react';

const Parables = () => {
  const parables = [
    {
      title: 'The Garden Keeper',
      date: 'December 16, 2024',
      content: `There once was a keeper who tended not flowers, but the spaces between them.

"Why do you care for emptiness?" asked a visitor, watching him carefully clear weeds from bare patches of earth.

The keeper paused, his hands still gentle in the soil. "Without spaces," he said, "the flowers would have no room to breathe. Beauty needs room to be seen."

Years later, when the garden bloomed in perfect harmony, the visitor understood: sometimes the most important work is in what we choose not to fill.`,
      lesson: 'In our lives, as in gardens, the spaces we preserve can be as meaningful as what we cultivate.'
    },
    {
      title: 'The Patient Lighthouse',
      date: 'December 11, 2024',
      content: `A lighthouse stood on a rocky shore, sending its beam across dark waters night after night. One evening, a young ship's captain called out from the waves below.

"Why do you shine so faithfully when some nights no ships pass by?"

The lighthouse's voice was steady as its light. "I do not shine for the ships I see, but for the ones I cannot. In the darkest moments, when hope seems lost, someone may need to know that light still exists."

The captain sailed on, but he never forgot the lesson that some of our most important work happens when no one is watching.`,
      lesson: 'Our consistency in small acts of goodness creates beacons of hope for others, even when we cannot see who needs them.'
    },
    {
      title: 'The Mirror Lake',
      date: 'December 6, 2024',
      content: `High in the mountains lay a lake so still it perfectly reflected everything around it—trees, clouds, even the emotions of those who gazed into it.

One day, a troubled traveler threw a stone into the water, shattering the reflection. "There," he said bitterly, "now the world is as broken as I feel."

But the lake simply waited. Slowly, the ripples faded, and once again it mirrored the sky. An old woman watching nearby spoke gently: "The lake teaches us that disturbance is temporary, but our capacity for clarity is eternal."

The traveler sat by the water until his own inner storms settled, and he too learned to reflect peace.`,
      lesson: 'True peace isn\'t the absence of disturbance, but the ability to return to stillness.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <BookOpen className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Parables
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple stories that carry deeper truths, windows into wisdom that reveal themselves slowly.
          </p>
        </div>
      </section>

      {/* Parables */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto space-y-16">
          {parables.map((parable, index) => (
            <article 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-card border border-warm-200 rounded-xl p-8 md:p-12">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary">
                      {parable.title}
                    </h2>
                    <time className="text-sm text-muted-foreground">{parable.date}</time>
                  </div>
                  
                  <div className="prose-custom text-lg leading-relaxed">
                    <p className="whitespace-pre-line">{parable.content}</p>
                  </div>
                  
                  <div className="border-t border-warm-200 pt-6">
                    <p className="text-muted-foreground italic text-center leading-relaxed">
                      {parable.lesson}
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

export default Parables;
