
import { BookOpen } from 'lucide-react';

const Poetry = () => {
  const poems = [
    {
      title: 'Morning Light',
      date: 'December 18, 2024',
      content: `Through amber glass
the morning spills its gold
across forgotten dreams,

each ray a whisper
of promises kept
in the language of dawn.

I catch them in cupped palms—
these fragments of light,
these moments before

the world remembers
its weight.`
    },
    {
      title: 'Between Lines',
      date: 'December 12, 2024',
      content: `What lives in the spaces
between written words?

The breath before speech,
the pause that holds meaning
like a mother holds sleep—

carefully,
knowing it will wake.

Here, in the white margins
of possibility,
stories write themselves.`
    },
    {
      title: 'The Gardener\'s Prayer',
      date: 'December 8, 2024',
      content: `Let me tend
not just what grows,
but what lies fallow.

Let me water
both the blooming
and the buried seed.

In soil and silence,
teach me the patience
of seasons,

the faith of roots
that reach toward light
they cannot see.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <BookOpen className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Poetry
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Verses that capture the fleeting moments, the quiet observations, the sacred ordinary.
          </p>
        </div>
      </section>

      {/* Poems */}
      <section className="section-container">
        <div className="max-w-2xl mx-auto space-y-16">
          {poems.map((poem, index) => (
            <article 
              key={index} 
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary">
                    {poem.title}
                  </h2>
                  <time className="text-sm text-muted-foreground">{poem.date}</time>
                </div>
                
                <div className="font-serif text-lg leading-relaxed text-foreground whitespace-pre-line max-w-lg mx-auto">
                  {poem.content}
                </div>
              </div>
              
              {index < poems.length - 1 && (
                <div className="mt-16 flex justify-center">
                  <div className="w-16 h-px bg-warm-300"></div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Poetry;
