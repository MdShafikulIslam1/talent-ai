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
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  // TODO:need to implement image generation
  // {
  //   label: "Image Generation",
  //   href: "/image",
  //   icon: ImageIcon,
  //   color: "text-pink-500",
  //   bgColor: "bg-pink-500/10",
  // },
  {
    label: "Sentiment Analysis",
    href: "/sentiment",
    icon: VideoIcon,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Music Generation",
    href: "/music",
    icon: MusicIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: CodeIcon,
    color: "text-purple-300",
    bgColor: "bg-purple-300/10",
  },

  {
    label: "Speech to Text Translation",
    href: "/audio-translation",
    icon: Languages,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Text Translation",
    href: "/translation",
    icon: Globe,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Grammar Correction",
    href: "/grammar-correction",
    icon: CheckCheck,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Summarize Text",
    href: "/summarize-text",
    icon: FileText,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    label: "Smart Paraphraser",
    href: "/smart-paraphraser",
    icon: Repeat,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];
