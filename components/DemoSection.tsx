"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

const demoTools = [
  {
    name: "Image Generator",
    href: "/image",
    description: "Create beautiful artwork from text",
    preview: "🎨 Generating: 'A futuristic city at sunset'",
    action: "Generate Image"
  },
  {
    name: "Code Assistant",
    href: "/code",
    description: "Write code from natural language",
    preview: "💻 Creating: React component for user login",
    action: "Generate Code"
  },
  {
    name: "Smart Translator",
    href: "/translate",
    description: "Translate text instantly",
    preview: "🌍 Translating: 'Hello World' → 'Hola Mundo'",
    action: "Translate Text"
  }
];

export function DemoSection() {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See AI in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our tools with live interactive demos
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {demoTools.map((tool, index) => (
              <Button
                key={index}
                variant={activeDemo === index ? "default" : "outline"}
                onClick={() => setActiveDemo(index)}
                className="h-auto p-4 text-left transition-all duration-300"
              >
                <div>
                  <div className="font-semibold">{tool.name}</div>
                  <div className="text-sm opacity-70">{tool.description}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <Card className="gradient-card min-h-[300px] flex items-center justify-center">
            <CardContent className="text-center">
              <div className="text-6xl mb-6 animate-float">
                {demoTools[activeDemo].preview.split(' ')[0]}
              </div>
              <CardTitle className="text-2xl mb-4">
                {demoTools[activeDemo].name}
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-6">
                {demoTools[activeDemo].preview}
              </p>
             <Link href={demoTools[activeDemo].href}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
              >
                {demoTools[activeDemo].action}
              </Button>
             </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
