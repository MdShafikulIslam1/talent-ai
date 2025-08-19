"use client";

import axios from "axios";
import { Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface SubscriptionButtonProps {
  isPro: boolean;
}
const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const onSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log("Stripe Billing Error error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={onSubscription}
      variant={isPro ? "default" : "premium"}
    >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 fill-white ml-2" />}
    </Button>
  );
};

export default SubscriptionButton;
