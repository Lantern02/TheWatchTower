import { useState } from 'react';
import { BookOpen, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ContentEditor from '@/components/ContentEditor';

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
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <User className="h-12 w-12 text-orange-700 mx-auto mb-6" />
          <ContentEditor
            page="about"
            sectionKey="header"
            title="About Me"
            defaultContent="A keeper of words, a seeker of quiet wisdom, and a believer in the power of stories to transform hearts."
            className="text-center"
          />
        </div>
      </section>

      {/* About Content */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-12">
            {/* Main Bio */}
            <ContentEditor
              page="about"
              sectionKey="main-bio"
              title="Main Bio"
              defaultContent={`Welcome to TheWatchTower, a space born from a simple belief: that in our hurried world, we need places to pause, reflect, and remember what matters most. I am a collector of quiet moments, a student of human nature, and someone who finds profound meaning in the ordinary details of daily life.

This corner of the internet serves as my watchtower—a place from which I observe the world with curiosity and wonder, then share what I see through words, poetry, prophecy, and stories. Here, you'll find reflections on books that have shaped my thinking, poems that capture fleeting moments of beauty, and visions that offer gentle wisdom for the journey we're all on.`}
              className="space-y-6"
            />

            {/* Philosophy */}
            <div className="bg-orange-50 rounded-xl p-8 md:p-12">
              <ContentEditor
                page="about"
                sectionKey="philosophy"
                title="My Writing Philosophy"
                defaultContent={`I believe that the best writing doesn't shout—it whispers. It doesn't demand attention—it earns it through honesty, beauty, and the recognition of shared humanity. Whether I'm crafting a poem about morning light or sharing thoughts about a book that moved me, my goal is always the same: to create moments of connection and understanding.

In a world full of noise, I choose to write from the quiet spaces—those in-between moments where wisdom often lives. I'm drawn to the power of simplicity, the beauty of restraint, and the profound impact of carefully chosen words.`}
              />
            </div>

            {/* What You'll Find */}
            <div className="grid md:grid-cols-2 gap-8">
              <ContentEditor
                page="about"
                sectionKey="what-youll-find"
                title="What You'll Find Here"
                defaultContent={`• Personal reflections on life, literature, and meaning
• Poetry that captures fleeting moments of beauty
• Prophetic visions offering gentle wisdom
• Book recommendations that have shaped my thinking
• Thoughts on the art of slow living and mindful reading`}
              />
              
              <ContentEditor
                page="about"
                sectionKey="hope-for-you"
                title="My Hope for You"
                defaultContent="My hope is that something here resonates with you—whether it's a line of poetry that captures how you're feeling, a reflection that offers a new perspective, or simply the reminder that you're not alone in finding meaning in the small, sacred moments of everyday life."
              />
            </div>

            {/* Contact Section - keeping form as is since it's functional */}
            <div className="bg-white border border-orange-200 rounded-xl p-8 md:p-12 shadow-sm">
              <div className="text-center mb-8">
                <Mail className="h-10 w-10 text-orange-700 mx-auto mb-4" />
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                  I'd love to hear from you. Share your thoughts, ask questions, or simply say hello.
                </p>
              </div>

              {/* ... keep existing code (form) */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-vertical"
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
                    className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    Subscribe to my newsletter for new writings and reflections
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-orange-50 rounded-xl p-8 md:p-12 text-center">
              <BookOpen className="h-10 w-10 text-orange-700 mx-auto mb-6" />
              <ContentEditor
                page="about"
                sectionKey="newsletter"
                title="Join the Newsletter"
                defaultContent={`Receive new writings, poetry, and reflections delivered gently to your inbox. No spam, just meaningful content when inspiration strikes.

Simply check the newsletter box in the form above, or mention it in your message.`}
                className="text-center"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
