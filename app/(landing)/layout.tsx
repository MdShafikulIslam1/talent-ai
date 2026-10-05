import VoiceAssistant from "@/components/VoiceAssistant";
import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";

// Rounded, friendly face for the landing page; the app itself keeps Inter.
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={`${jakarta.className} h-full overflow-auto`}>
      <div className="h-screen w-full">
        {children}
        <VoiceAssistant />
      </div>
    </main>
  );
};

export default LandingLayout;
