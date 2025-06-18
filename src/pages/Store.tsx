
import { BookOpen } from 'lucide-react';

const Store = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-warm-50 to-warm-100 py-16">
        <div className="section-container text-center">
          <BookOpen className="h-12 w-12 text-warm-700 mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4">
            Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A carefully curated collection of writings and literary offerings, coming soon.
          </p>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card border border-warm-200 rounded-xl p-12 md:p-16 animate-fade-in">
            <div className="space-y-8">
              <div className="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center mx-auto">
                <BookOpen className="h-12 w-12 text-warm-700" />
              </div>
              
              <div className="space-y-4">
                <h2 className="font-serif text-3xl font-semibold text-primary">
                  Something Beautiful is Coming
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm currently working on a collection of writings, poems, and reflections that will be available 
                  for you to take home—both in digital and physical form. Think of it as a way to carry these 
                  quiet moments and gentle wisdom with you wherever you go.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold text-primary">What's Coming</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Poetry collections in beautifully designed formats</li>
                    <li>• Reflection journals with guided prompts</li>
                    <li>• Digital and print versions of my writings</li>
                    <li>• Limited edition handcrafted items</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-serif text-xl font-semibold text-primary">Be the First to Know</h3>
                  <p className="text-muted-foreground">
                    Join the newsletter to be notified when the store launches. Subscribers will receive 
                    early access and special offers on all new releases.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <a 
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-warm-800 transition-colors duration-200 font-medium"
                >
                  <span>Join the Newsletter</span>
                </a>
              </div>

              <p className="text-sm text-muted-foreground italic">
                "The best things take time to create, and even longer to perfect. Thank you for your patience 
                as I craft something truly meaningful for you."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Store;
