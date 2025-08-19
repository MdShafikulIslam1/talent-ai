"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TypeWriterComponent from "typewriter-effect";
import { Button } from "./ui/button";

const LandingHero = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="py-36 font-bold text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold space-y-4">
        <h1 className="text-white">The Best AI Tool for</h1>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
          <TypeWriterComponent
            options={{
              strings: [
                "Chatting with AI.",
                "Code Generation.",
                // TODO:need to implement image generation
                // "Image Generation.",
                "Music Generation.",
                "Video Generation.",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-zinc-500 font-light text-sm md:text-xl">
        Create content using Ai 10x faster
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            variant={"premium"}
            className="rounded-full p-4 md:p-6 font-semibold"
          >
            Create Content For Free
          </Button>
        </Link>
      </div>
      <div className="text-xl md:text-sm text-zinc-500 font-normal">
        No Need Credit Card Information
      </div>
    </div>
  );
};

export default LandingHero;
