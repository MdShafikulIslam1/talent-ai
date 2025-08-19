"use client";
import { cn } from "@/lib/utils";
import {
  CheckCheck,
  CodeIcon,
  FileText,
  Globe,
  Languages,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Repeat,
  Settings
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FreeCounter from "./freeCounter";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-violet-500",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: CodeIcon,
    color: "text-purple-300",
  },
  {
    label: "Sentiment Analysis",
    href: "/sentiment",
    icon: MessageCircle,
    color: "text-purple-300",
  },
  // TODO:need to implement image generation
  // {
  //   label: "Image Generation",
  //   href: "/image",
  //   icon: ImageIcon,
  //   color: "text-pink-500",
  // },
  {
    label: "Speech to Text Translation",
    href: "/audio-translation",
    icon: Languages,
    color: "text-pink-500",
  },
  {
    label: "Text Translation",
    href: "/translation",
    icon: Globe,
    color: "text-pink-500",
  },
  {
    label: "Grammar Correction",
    href: "/grammar-correction",
    icon: CheckCheck,
    color: "text-pink-500",
  },
  {
    label: "Summarize Text",
    href: "/summarize-text",
    icon: FileText,
    color: "text-pink-500",
  },
  {
    label: "Smart Paraphraser",
    href: "/smart-paraphraser",
    icon: Repeat,
    color: "text-pink-500",
  },
  // {
  //   label: "Video Generation",
  //   href: "/video",
  //   icon: VideoIcon,
  //   color: "text-green-500",
  // },
  // {
  //   label: "Music Generation",
  //   href: "/music",
  //   icon: MusicIcon,
  //   color: "text-orange-700",
  // },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 h-full flex flex-col bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href={"/dashboard"} className="flex items-center pl-3 mb-14">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-800 to-blue-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Talent-AI
            </div>
          </div>
          {/* <div className="relative w-16 h-16 mr-4 ">
            <Image fill alt="logo" src={"/logo.png"} className="bg-white" />
          </div> */}
          {/* <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Talent AI
          </h1> */}
        </Link>
        {/* side bar routes */}
        <div className="space-y-1">
          {routes.map((route, index) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "flex justify-start hover:text-white hover:bg-white/10 rounded-lg text-sm cursor-pointer group p-3",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!isPro && <FreeCounter apiLimitCount={apiLimitCount} />}
    </div>
  );
};

export default Sidebar;
