import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Check, Crown, Rocket, Star, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out AI capabilities",
    icon: Star,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "3 AI generations",
      "Basic image creation",
      "Text summarization",
      "Limited API access",
      "Code generation",
      "Grammar correction",
      "Community support",
      "Standard processing speed",
    ],
    buttonText: "Get Started Free",
    popular: false,
    href: "/dashboard",
    delay: "0ms",
  },
  {
    name: "Pro",
    price: "$20",
    description: "Ideal for professionals and creators",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
    features: [
      "Unlimited AI generations",
      "Advanced image & video tools",
      "Priority processing",
      "API access",
      "Premium support",
      "Custom models",
      "Batch processing",
    ],
    buttonText: "Start Pro Trial",
    popular: true,
    href: "/dashboard",
    delay: "200ms",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for large teams",
    icon: Crown,
    gradient: "from-orange-500 to-red-500",
    features: [
      "Everything in Pro",
      "White-label solutions",
      "Dedicated infrastructure",
      "Custom integrations",
      "SLA guarantees",
      "Advanced analytics",
      "24/7 dedicated support",
    ],
    buttonText: "Contact Sales",
    popular: false,
    href: "/dashboard",
    delay: "400ms",
  },
];

export function PricingSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
   const { isSignedIn } = useAuth();

  const onSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("Stripe client error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, cardIndex]);
            }, cardIndex * 150);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="pt-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-7xl font-black mb-8 gradient-text ">
            Choose Your Plan
          </h2>
          <p className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Unlock the power of AI with plans designed for
            <span className="gradient-text font-semibold"> every need</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={index}
                data-index={index}
                className={`gradient-card hover-lift transition-all duration-700 cursor-pointer group relative overflow-hidden ${
                  visibleCards.includes(index)
                    ? "animate-scale-in"
                    : "opacity-0"
                } ${
                  plan.popular
                    ? "scale-100 ring-2 ring-primary/50 shadow-2xl pt-4"
                    : ""
                }`}
                style={
                  {
                    animationDelay: plan.delay,
                    "--stagger-delay": plan.delay,
                  } as React.CSSProperties
                }
              >
                {plan.popular && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full text-sm font-semibold animate-glow flex items-center gap-2">
                      <Rocket className="w-4 h-4 animate-wiggle" />
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div
                    className={`mb-6 group-hover:animate-wiggle transition-all duration-300`}
                  >
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} w-fit mx-auto animate-glow`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:gradient-text transition-all duration-300">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl md:text-5xl font-black gradient-text">
                      {plan.price}
                    </span>
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription className="text-lg mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3 animate-slide-in-left"
                        style={{
                          animationDelay: `${
                            parseInt(plan.delay) + featureIndex * 50
                          }ms`,
                        }}
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-pulse-slow">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => {
                      if (!isSignedIn) {
                        window.location.href = "/sign-in";
                        return;
                      }

                      else if (plan.name === "Starter") {
                        window.location.href = "/dashboard";
                      } else if (plan.name === "Pro") {
                        onSubscription();
                      } else if (plan.name === "Enterprise") {
                        alert("Please contact sales for Enterprise plans.");
                      }
                    }}
                    className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 animate-glow hover-lift ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-accent text-white"
                        : "bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/30 hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="text-center mt-16 animate-slide-up"
          style={{ animationDelay: "600ms" }}
        >
          <p className="text-muted-foreground text-lg mb-4">
            Need a custom solution?
            <span className="gradient-text font-semibold">
              {" "}
              Let&apos;s talk!
            </span>
          </p>
          <Button variant="outline" className="hover-lift group">
            <Crown className="mr-2 h-5 w-5 group-hover:animate-wiggle" />
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
