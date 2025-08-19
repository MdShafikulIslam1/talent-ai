"use client";
import { MAX_FREE_COUNT } from "@/constant";
import { userProModal } from "@/hooks/user-pro-modal";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

interface FreeCounterProps {
  apiLimitCount: number;
}
const FreeCounter = ({ apiLimitCount = 0 }: FreeCounterProps) => {
  const proModal = userProModal();
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) {
    return null;
  }
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {apiLimitCount} / {MAX_FREE_COUNT} free Generation
            </p>
            <Progress
              className="h-3"
              value={(apiLimitCount / MAX_FREE_COUNT) * 100}
            />
          </div>
          <Button
            className="w-full"
            variant="premium"
            onClick={proModal.onOpen}
          >
            Upgrade
            <Zap className="ml-2 w-4 h-4 fill-white" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreeCounter;
