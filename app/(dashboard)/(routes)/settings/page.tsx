import Heading from "@/components/heading";
import SubscriptionButton from "@/components/subscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import { Settings } from "lucide-react";

const SettingPage = async () => {
  const isPro = await checkSubscription();
  console.log("is pro package", isPro);
  return (
    <div>
      <Heading
        title="Settings"
        description="Manage your account"
        icon={Settings}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are already subscribed pro plan"
            : "Currently you are ongoing free plan"}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  );
};

export default SettingPage;
