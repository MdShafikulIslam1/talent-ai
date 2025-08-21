import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import VoiceAssistant from "@/components/VoiceAssistant";
import { checkSubscription } from "@/lib/subscription";
import { getUserApiLimitCount } from "@/lib/userApiLimit";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getUserApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className="h-full relative">
      {/* side bar */}
      <div className="hidden md:h-full md:flex md:flex-col md:w-72 md:fixed md:inset-y-0 md:bg-gray-900">
        <div className="flex-1 overflow-y-auto">
          <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        </div>
      </div>
      {/* main component */}
      <main className="md:pl-72">
        <Navbar />
        {children}
        <VoiceAssistant />
      </main>
    </div>
  );
};

export default DashboardLayout;
