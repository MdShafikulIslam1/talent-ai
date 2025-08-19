
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-10 dark:opacity-20"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Experience the
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Future of AI?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators, developers, and innovators who are already using Talent-AI to transform their work.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Link href="/sign-up">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-6 animate-glow"
            >
              Sign Up Now
            </Button></Link>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 transition-all duration-300 text-lg px-8 py-6"
            >
              Contact Sales
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free tier available • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
