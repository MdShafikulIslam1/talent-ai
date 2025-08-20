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
  Settings,
  Sparkles,
  Zap,
  Mic,
  Volume2,
  AudioLines
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
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    hoverColor: "hover:bg-sky-500/20",
    category: "main"
  },
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    hoverColor: "hover:bg-violet-500/20",
    category: "ai"
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: CodeIcon,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    hoverColor: "hover:bg-emerald-500/20",
    category: "ai"
  },
  {
    label: "Sentiment Analysis",
    href: "/sentiment",
    icon: MessageCircle,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    hoverColor: "hover:bg-purple-500/20",
    category: "ai"
  },
  {
    label: "Voice to Text",
    href: "/voice-to-text",
    icon: Mic,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    hoverColor: "hover:bg-red-500/20",
    category: "ai"
  },
  {
    label: "Text to Audio",
    href: "/text-to-audio",
    icon: Volume2,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    category: "ai"
  },
  {
    label: "Voice to Voice",
    href: "/voice-to-voice",
    icon: AudioLines,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    category: "ai"
  },
  {
    label: "Speech to Text Translation",
    href: "/audio-translation",
    icon: Languages,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    hoverColor: "hover:bg-pink-500/20",
    category: "tools"
  },
  {
    label: "Text Translation",
    href: "/translation",
    icon: Globe,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    hoverColor: "hover:bg-indigo-500/20",
    category: "tools"
  },
  {
    label: "Grammar Correction",
    href: "/grammar-correction",
    icon: CheckCheck,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    hoverColor: "hover:bg-green-500/20",
    category: "tools"
  },
  {
    label: "Summarize Text",
    href: "/summarize-text",
    icon: FileText,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    hoverColor: "hover:bg-orange-500/20",
    category: "tools"
  },
  {
    label: "Smart Paraphraser",
    href: "/smart-paraphraser",
    icon: Repeat,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    hoverColor: "hover:bg-cyan-500/20",
    category: "tools"
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    hoverColor: "hover:bg-gray-500/20",
    category: "config"
  },
];

const categories = {
  main: { label: "Main", icon: LayoutDashboard },
  ai: { label: "AI Tools", icon: Sparkles },
  tools: { label: "Text Tools", icon: Zap },
  config: { label: "Configuration", icon: Settings }
};

interface SidebarProps {
  apiLimitCount: number;
  isPro: boolean;
}

const Sidebar = ({ apiLimitCount = 0, isPro }: SidebarProps) => {
  const pathname = usePathname();
  
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, typeof routes>);

  return (
    <div className="relative space-y-4 py-6 h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 -left-6 w-20 h-20 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Logo Section - Fixed at top */}
      <div className="relative px-4 py-2 flex-shrink-0">
        <Link href={"/dashboard"} className="flex items-center pl-3 mb-6 group">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-5 h-5 bg-white rounded-md shadow-inner"></div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
              Talent-AI
            </div>
          </div>
        </Link>
      </div>

      {/* Scrollable Navigation Routes */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500 scrollbar-thumb-rounded-full">
          <div className="space-y-6 pr-2">
          {Object.entries(groupedRoutes).map(([categoryKey, categoryRoutes]) => (
            <div key={categoryKey} className="space-y-2">
              {/* Category Header */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {categories[categoryKey as keyof typeof categories]?.label}
                </span>
              </div>

              {/* Category Routes */}
              <div className="space-y-1">
                {categoryRoutes.map((route, index) => {
                  const isActive = pathname === route.href;
                  return (
                    <Link
                      href={route.href}
                      key={`${route.href}-${index}`}
                      className={cn(
                        "relative flex items-center justify-start rounded-xl text-sm cursor-pointer group p-3 mx-2 transition-all duration-300 transform hover:scale-[1.02]",
                        isActive
                          ? `text-white ${route.bgColor} shadow-lg border border-white/10`
                          : `text-gray-300 hover:text-white ${route.hoverColor} hover:shadow-md`,
                        "backdrop-blur-sm"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                      )}
                      
                      {/* Icon container */}
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300",
                        isActive ? route.bgColor : "group-hover:scale-110"
                      )}>
                        <route.icon className={cn("w-4 h-4", route.color)} />
                      </div>
                      
                      {/* Label */}
                      <span className="flex-1 font-medium">
                        {route.label}
                      </span>
                      
                      {/* Hover glow effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                        route.bgColor,
                        "blur-xl -z-10"
                      )}></div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Free Counter - Fixed at bottom */}
      {!isPro && (
        <div className="relative px-4 flex-shrink-0">
          <div className="mx-2 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
            <FreeCounter apiLimitCount={apiLimitCount} />
          </div>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Sidebar;