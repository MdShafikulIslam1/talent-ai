"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  CheckCheck,
  Code,
  FileText,
  Globe,
  MessageSquare,
  Repeat
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Chat Assistant",
    description:
      "Intelligent conversational AI that understands context and provides helpful responses",
    icon: MessageSquare,
    gradient: "from-teal-500 via-blue-500 to-indigo-500",
    delay: "700ms",
  },
  // TODO:need to implement image generation
  // {
  //   title: "AI Image Generation",
  //   description:
  //     "Create stunning, photorealistic images from simple text descriptions using cutting-edge AI models",
  //   icon: Image,
  //   gradient: "from-pink-500 via-purple-500 to-indigo-500",
  //   delay: "0ms",
  // },
  {
    title: "Smart Translation",
    description:
      "Instant, context-aware translation across 150+ languages with cultural nuances preserved",
    icon: Globe,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    delay: "100ms",
  },
  {
    title: "Intelligent Summarization",
    description:
      "Extract key insights and create concise summaries from documents, articles, and reports",
    icon: FileText,
    gradient: "from-green-500 via-emerald-500 to-cyan-500",
    delay: "200ms",
  },
  {
    title: "Code Generation",
    description:
      "Transform natural language into functional code across multiple programming languages",
    icon: Code,
    gradient: "from-yellow-500 via-orange-500 to-red-500",
    delay: "300ms",
  },
  {
    title: "Grammar Correction",
    description:
      "AI-powered grammar and style correction for polished, professional writing",
    icon: CheckCheck,
    gradient: "from-pink-500 via-red-500 to-orange-500",
    delay: "400ms",
  },
   {
    label: "Smart Paraphraser",
    description:
      "Rephrase and enhance text for clarity, tone, and style using advanced AI algorithms",
    icon: Repeat,
    gradient: "from-pink-500 via-red-500 to-orange-500",
    delay: "400ms",
  },
  {
    title: "Creative Assistant",
    description:
      "AI-powered brainstorming, content creation, and creative problem-solving companion",
    icon: Brain,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    delay: "500ms",
  },
  // {
  //   title: "Design Tools",
  //   description:
  //     "Generate logos, color palettes, and design elements with AI-driven creativity",
  //   icon: Palette,
  //   gradient: "from-orange-500 via-red-500 to-pink-500",
  //   delay: "600ms",
  // },

  // {
  //   title: "Video Processing",
  //   description:
  //     "AI-powered video editing, enhancement, and automated content generation",
  //   icon: Video,
  //   gradient: "from-purple-500 via-blue-500 to-cyan-500",
  //   delay: "800ms",
  // },
  // {
  //   title: "Audio Magic",
  //   description:
  //     "Create, edit, and enhance audio content with AI-powered music and sound generation",
  //   icon: Music,
  //   gradient: "from-pink-500 via-red-500 to-orange-500",
  //   delay: "900ms",
  // },
  // {
  //   title: "Data Analysis",
  //   description:
  //     "Intelligent data processing, pattern recognition, and automated insights generation",
  //   icon: Database,
  //   gradient: "from-cyan-500 via-blue-500 to-purple-500",
  //   delay: "1000ms",
  // },
  // {
  //   title: "And Much More",
  //   description:
  //     "Discover our ever-expanding collection of AI-powered tools and cutting-edge features",
  //   icon: Sparkles,
  //   gradient: "from-gradient-start via-gradient-middle to-gradient-end",
  //   delay: "1100ms",
  // },
];

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

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
            }, cardIndex * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="pt-20  bg-gradient-to-b from-background to-muted/30 relative overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-5xl md:text-4xl font-black mb-6 gradient-text">
            Powerful AI Arsenal
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Unleash the full potential of artificial intelligence with our
            <br />
            <span className="gradient-text font-semibold">
              {" "}
              comprehensive toolkit
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                data-index={index}
                className={`gradient-card hover-lift transition-all duration-700 cursor-pointer group relative overflow-hidden ${
                  visibleCards.includes(index)
                    ? "animate-scale-in"
                    : "opacity-0"
                }`}
                style={
                  {
                    animationDelay: feature.delay,
                    "--stagger-delay": feature.delay,
                  } as React.CSSProperties
                }
              >
                <CardHeader>
                  <div
                    className={`relative mb-6 group-hover:animate-wiggle transition-all duration-300`}
                  >
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit mx-auto animate-glow`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:gradient-text transition-all duration-300 text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
