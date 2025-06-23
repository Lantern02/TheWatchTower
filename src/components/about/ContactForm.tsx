
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
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
  );
};

export default ContactForm;
