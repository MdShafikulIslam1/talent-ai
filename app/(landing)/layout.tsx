import VoiceAssistant from "@/components/VoiceAssistant";
import React from "react";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full overflow-auto">
      <div className="h-screen w-full">
        {children}
        <VoiceAssistant />
      </div>
    </main>
  );
};

export default LandingLayout;
