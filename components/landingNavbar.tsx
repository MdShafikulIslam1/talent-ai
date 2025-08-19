"use client";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="p-4 flex items-center justify-between bg-transparent">
      <Link href={"/"} className="flex items-center">
        <div className="w-8 h-8 relative mr-4">
          <Image fill alt="logo" src={"/logo.png"} />
        </div>
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          Talent AI
        </h1>
      </Link>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant={"outline"} className="rounded-full">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingNavbar;
