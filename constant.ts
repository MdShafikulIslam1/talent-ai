export const MAX_FREE_COUNT = 10;

import {
  CheckCheck,
  CodeIcon,
  FileText,
  Globe,
  Languages,
  MessageSquare,
  MusicIcon,
  Repeat,
  VideoIcon,
} from "lucide-react";

export const tools = [
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  // TODO:need to implement image generation
  // {
  //   label: "Image Generation",
  //   href: "/image",
  //   icon: ImageIcon,
  //   color: "text-brand",
  //   bgColor: "bg-brand/10",
  // },
  {
    label: "Sentiment Analysis",
    href: "/sentiment",
    icon: VideoIcon,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    label: "Music Generation",
    href: "/music",
    icon: MusicIcon,
    color: "text-flame-700",
    bgColor: "bg-flame-700/10",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: CodeIcon,
    color: "text-brand-300",
    bgColor: "bg-brand-300/10",
  },

  {
    label: "Speech to Text Translation",
    href: "/audio-translation",
    icon: Languages,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    label: "Text Translation",
    href: "/translation",
    icon: Globe,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    label: "Grammar Correction",
    href: "/grammar-correction",
    icon: CheckCheck,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    label: "Summarize Text",
    href: "/summarize-text",
    icon: FileText,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
  {
    label: "Smart Paraphraser",
    href: "/smart-paraphraser",
    icon: Repeat,
    color: "text-brand",
    bgColor: "bg-brand/10",
  },
];
