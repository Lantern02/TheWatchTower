
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, name: name || null }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            variant: "destructive",
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for joining our literary community.",
        });
        setEmail('');
        setName('');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Subscription failed",
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-warm-50 py-16">
      <div className="section-container text-center">
        <Mail className="h-12 w-12 text-warm-700 mx-auto mb-6" />
        <h2 className="font-serif text-3xl font-semibold text-primary mb-4">
          Join Our Literary Journey
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Subscribe to receive thoughtful reflections, new writings, and curated book recommendations directly in your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <Input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
