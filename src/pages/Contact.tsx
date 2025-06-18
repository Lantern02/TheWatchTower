
import { useState } from 'react';
import { Mail, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
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
          <Mail className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'd love to hear from you. Share your thoughts, ask questions, or simply say hello.
          </p>
        </div>
      </section>

      <section className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border border-warm-200 rounded-xl p-8 md:p-12 animate-fade-in">
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
          <div className="mt-12 bg-warm-50 rounded-xl p-8 md:p-12 text-center animate-fade-in">
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
      </section>
    </div>
  );
};

export default Contact;
