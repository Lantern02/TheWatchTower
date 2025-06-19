
import { useState } from 'react';
import { BookOpen, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const About = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

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
                world with curiosity and wonder, then share what I see through words, poetry, prophecy, and stories. 
                Here, you'll find reflections on books that have shaped my thinking, poems that capture 
                fleeting moments of beauty, and visions that offer gentle wisdom for the journey we're all on.
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
                  <li>• Prophetic visions offering gentle wisdom</li>
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

            {/* Contact Section */}
            <div className="bg-card border border-warm-200 rounded-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <Mail className="h-10 w-10 text-warm-700 mx-auto mb-4" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-4">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  I'd love to hear from you. Share your thoughts, ask questions, or simply say hello.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  >
                    <option value="">Choose a topic</option>
                    <option value="general">General inquiry</option>
                    <option value="writing">About my writing</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="book-recommendation">Book recommendation</option>
                    <option value="newsletter">Newsletter subscription</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-warm-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical"
                    placeholder="Share your thoughts..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-warm-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                    Subscribe to my newsletter for new writings and reflections
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg hover:bg-warm-800 transition-colors duration-200 font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-warm-50 rounded-xl p-8 md:p-12 text-center">
              <BookOpen className="h-10 w-10 text-warm-700 mx-auto mb-6" />
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-primary mb-4">
                Join the Newsletter
              </h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-lg mx-auto">
                Receive new writings, poetry, and reflections delivered gently to your inbox. 
                No spam, just meaningful content when inspiration strikes.
              </p>
              <p className="text-sm text-muted-foreground">
                Simply check the newsletter box in the form above, or mention it in your message.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
