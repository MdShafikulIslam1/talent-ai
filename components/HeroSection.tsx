import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const words = ["Create", "Transform", "Generate", "Innovate"];

  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "AI-Powered Innovation",
      description: "Experience the future of technology",
    },
    {
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Smart Solutions",
      description: "Transform your workflow instantly",
    },
    {
      url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      title: "Creative Intelligence",
      description: "Unleash unlimited possibilities",
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => {
      clearInterval(wordInterval);
      clearInterval(imageInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 mt-16">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-cyan-600/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 ${
              isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 mb-8 animate-scale-in "
              style={{ animationDelay: "0.2s" }}
            >
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Powered by Advanced AI
              </span>
            </div>

            {/* Animated Heading */}
            <h1
              className="text-3xl md:text-4xl font-bold mb-6 leading-tight tracking-tight animate-scale-in"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-800 dark:from-slate-100 dark:via-blue-300 dark:to-indigo-200 bg-clip-text text-transparent animate-pulse-slow">
                  {words[currentWord]}
                </span>
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></span>
              </span>
              <br />
              <span className="text-slate-700 dark:text-slate-300 font-light relative">
                the Future
                <span
                  className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 animate-scale-in origin-left"
                  style={{ animationDelay: "0.8s" }}
                ></span>
              </span>
            </h1>

            {/* Animated Subtitle */}
            <div
              className="animate-slide-up mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              <p className="text-xl  text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                <span
                  className="inline-block animate-fade-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  Transform your creative process with
                </span>{" "}
                <span
                  className="inline-block animate-fade-in bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium"
                  style={{ animationDelay: "0.8s" }}
                >
                  AI-powered tools
                </span>{" "}
                <span
                  className="inline-block animate-fade-in"
                  style={{ animationDelay: "1s" }}
                >
                  that understand your vision and bring ideas to life in
                  seconds.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center animate-slide-up mb-12"
              style={{ animationDelay: "0.7s" }}
            >
              <Link href="/dashboard">
              <Button
                size="lg"
                className="group relative bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 text-lg px-10 py-6 rounded-2xl shadow-xl border-0 animate-glow"
              >
                <div className="flex items-center">
                  <Sparkles className="mr-3 h-5 w-5 group-hover:animate-spin transition-transform" />
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
              </Link>
              {/* <Button
                variant="outline"
                size="lg"
                className="group border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 transform hover:scale-105 text-lg px-10 py-6 rounded-2xl backdrop-blur-sm"
              >
                <Play className="mr-3 h-5 w-5 group-hover:animate-pulse transition-transform" />
                Watch Demo
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button> */}
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 animate-fade-in"
              style={{ animationDelay: "0.9s" }}
            >
              {[
                { number: "50K+", label: "Active Users" },
                { number: "1M+", label: "AI Generations" },
                { number: "99.9%", label: "Uptime" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center animate-scale-in hover:scale-110 transition-transform duration-300"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Carousel */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "animate-slide-in-right" : "opacity-0"
            }`}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Carousel Images */}
              <div className="relative w-full h-full">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.title}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Image Text Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 animate-slide-up">
                        {image.title}
                      </h3>
                      <p className="text-lg opacity-90 animate-fade-in">
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white scale-150"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-float animate-spin opacity-80"></div>
            <div
              className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl animate-float opacity-60 animate-spin"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="mt-24 flex justify-center animate-bounce-slow">
          <div className="w-1 h-16 bg-gradient-to-b from-slate-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
