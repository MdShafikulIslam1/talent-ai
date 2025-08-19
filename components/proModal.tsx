// "use client";

// import { tools } from "@/constant";
// import { userProModal } from "@/hooks/user-pro-modal";
// import { cn } from "@/lib/utils";
// import axios from "axios";
// import { Check, Zap } from "lucide-react";
// import { useState } from "react";
// import { Badge } from "./ui/badge";
// import { Button } from "./ui/button";
// import { Card } from "./ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "./ui/dialog";

// const ProModal = () => {
//   const proModal = userProModal();
//   const [isLoading, setIsLoading] = useState(false);
//   const onSubscription = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("/api/stripe");
//       window.location.href = response.data.url;
//     } catch (error) {
//       console.log("Stripe client error: ", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="flex flex-col justify-center items-center gap-y-2 pb-2">
//             <div className="flex  items-center gap-x-2 font-bold py-1">
//               Upgrade to talent AI
//               <Badge variant={"premium"} className="uppercase text-sm py-1">
//                 pro
//               </Badge>
//             </div>
//           </DialogTitle>
//           <DialogDescription className="space-y-2 pt-2 text-center font-medium text-zinc-900">
//             {tools.map((tool) => (
//               <Card
//                 key={tool.href}
//                 className="flex items-center justify-between p-3 border-black/5"
//               >
//                 <div className="flex items-center gap-x-4">
//                   <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
//                     <tool.icon className={cn("w-6 h-6", tool.color)} />
//                   </div>
//                   <div className="font-semibold text-sm">{tool.label}</div>
//                 </div>
//                 <Check className="text-primary w-5 h-5" />
//               </Card>
//             ))}
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button
//             disabled={isLoading}
//             onClick={onSubscription}
//             variant={"premium"}
//             size={"lg"}
//             className="w-full"
//           >
//             Upgrade
//             <Zap className="w-4 h-4 fill-white ml-2" />
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProModal;



"use client";

import axios from "axios";
import { Check, Rocket, Zap } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userProModal } from "@/hooks/user-pro-modal";

const proPlan = {
  name: "Pro",
  price: "$20",
  description: "Ideal for professionals and creators",
  icon: Zap,
  gradient: "from-purple-500 to-pink-500",
  features: [
    "Unlimited AI generations",
    "Advanced image & video tools",
    "Priority processing",
    "API access",
    "Premium support",
    "Custom models",
    "Batch processing",
  ],
  buttonText: "Start Pro Trial",
};

const ProModal = () => {
  const proModal = userProModal();
  const [isLoading, setIsLoading] = useState(false);

  const onSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Stripe client error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = proPlan.icon;

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-3xl font-bold">
            Upgrade to Pro
          </DialogTitle>
          <div className="flex justify-center mt-2">
            <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Rocket className="w-4 h-4 animate-wiggle" />
              Most Popular
            </div>
          </div>
        </DialogHeader>

        <Card className="relative overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="mb-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${proPlan.gradient} w-fit mx-auto`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl font-bold">{proPlan.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-extrabold gradient-text">
                {proPlan.price}
              </span>
              <span className="text-muted-foreground"> /month</span>
            </div>
            <CardDescription className="text-sm mt-1">
              {proPlan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {proPlan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              disabled={isLoading}
              onClick={onSubscription}
              className="w-full text-sm py-4 font-semibold rounded-lg bg-gradient-to-r from-primary to-accent text-white hover:scale-105 transition"
            >
              {isLoading ? "Redirecting..." : proPlan.buttonText}
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
