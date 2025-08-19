
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  // TODO:need to implement image generation
  // {
  //   name: "Sarah Johnson",
  //   role: "Content Creator",
  //   content: "Talent-AI has revolutionized my workflow. The image generation feature saves me hours of design work!",
  //   avatar: "SJ"
  // },
  {
    name: "Mike Chen",
    role: "Software Developer",
    content: "The code generation tool is incredible. It understands context and writes clean, functional code.",
    avatar: "MC"
  },
  {
    name: "Emma Davis",
    role: "Marketing Manager",
    content: "Translation and summarization features have made our global campaigns so much more efficient.",
    avatar: "ED"
  }
];

export function TestimonialsSection() {
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleTestimonials(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const testimonialElements = sectionRef.current?.querySelectorAll('[data-index]');
    testimonialElements?.forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Talent-AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              data-index={index}
              className={`gradient-card hover:scale-105 transition-all duration-500 ${
                visibleTestimonials.includes(index) ? 'animate-slide-in-left' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
