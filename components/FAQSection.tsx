
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What AI models does Talent-AI use?",
    answer: "We use state-of-the-art models including GPT-4, DALL-E, and custom-trained models for optimal performance across all our features."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a generous free tier with limited usage so you can explore all our features before upgrading."
  },
  {
    question: "How secure is my data?",
    answer: "We take security seriously. All data is encrypted in transit and at rest, and we never store your personal content longer than necessary."
  },
  {
    question: "Can I integrate Talent-AI with my existing tools?",
    answer: "Absolutely! We offer robust APIs and integrations with popular platforms like Slack, Discord, and more coming soon."
  },
  {
    question: "What languages are supported?",
    answer: "Our translation and text processing features support over 100 languages with high accuracy and context awareness."
  }
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about Talent-AI
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="gradient-card rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
