
import { BookOpen, User } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <User className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            About Me
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A keeper of words, a seeker of quiet wisdom, and a believer in the power of stories to transform hearts.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12 animate-fade-in">
            {/* Main Bio */}
            <div className="prose-custom space-y-6">
              <p className="text-lg leading-relaxed">
                Welcome to TheWatchTower, a space born from a simple belief: that in our hurried world, 
                we need places to pause, reflect, and remember what matters most. I am a collector of 
                quiet moments, a student of human nature, and someone who finds profound meaning in the 
                ordinary details of daily life.
              </p>
              
              <p className="text-lg leading-relaxed">
                This corner of the internet serves as my watchtower—a place from which I observe the 
                world with curiosity and wonder, then share what I see through words, poetry, and stories. 
                Here, you'll find reflections on books that have shaped my thinking, poems that capture 
                fleeting moments of beauty, and parables that offer gentle wisdom for the journey we're all on.
              </p>
            </div>

            {/* Philosophy */}
            <div className="bg-warm-50 rounded-xl p-8 md:p-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-6">
                My Writing Philosophy
              </h2>
              <div className="space-y-4 prose-custom">
                <p>
                  I believe that the best writing doesn't shout—it whispers. It doesn't demand attention—it 
                  earns it through honesty, beauty, and the recognition of shared humanity. Whether I'm 
                  crafting a poem about morning light or sharing thoughts about a book that moved me, 
                  my goal is always the same: to create moments of connection and understanding.
                </p>
                <p>
                  In a world full of noise, I choose to write from the quiet spaces—those in-between 
                  moments where wisdom often lives. I'm drawn to the power of simplicity, the beauty 
                  of restraint, and the profound impact of carefully chosen words.
                </p>
              </div>
            </div>

            {/* What You'll Find */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-primary">What You'll Find Here</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Personal reflections on life, literature, and meaning</li>
                  <li>• Poetry that captures fleeting moments of beauty</li>
                  <li>• Modern parables offering gentle wisdom</li>
                  <li>• Book recommendations that have shaped my thinking</li>
                  <li>• Thoughts on the art of slow living and mindful reading</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-primary">My Hope for You</h3>
                <p className="text-muted-foreground leading-relaxed">
                  My hope is that something here resonates with you—whether it's a line of poetry 
                  that captures how you're feeling, a reflection that offers a new perspective, 
                  or simply the reminder that you're not alone in finding meaning in the small, 
                  sacred moments of everyday life.
                </p>
              </div>
            </div>

            {/* Connect */}
            <div className="text-center bg-card border border-warm-200 rounded-xl p-8">
              <BookOpen className="h-8 w-8 text-warm-700 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                Let's Stay Connected
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                I'd love to hear from you. Whether you want to share your thoughts on something I've written, 
                recommend a book, or simply say hello, I believe in the power of genuine conversation.
              </p>
              <a 
                href="/contact"
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-warm-800 transition-colors duration-200 font-medium"
              >
                <span>Get in Touch</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
