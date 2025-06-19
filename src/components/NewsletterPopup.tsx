
import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NewsletterPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "You've been subscribed to our newsletter.",
      });

      setIsVisible(false);
      localStorage.setItem('newsletter-popup-seen', 'true');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message.includes('duplicate') 
          ? "You're already subscribed!" 
          : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-popup-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2"
          onClick={handleDecline}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-amber-700 mx-auto mb-4" />
          <CardTitle className="font-serif text-xl text-primary">
            Stay Connected
          </CardTitle>
          <CardDescription>
            Join our community of contemplative readers and receive weekly reflections directly in your inbox.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
              <Button type="button" variant="outline" onClick={handleDecline}>
                No Thanks
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterPopup;
