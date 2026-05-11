import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useInView, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const queryClient = new QueryClient();

function LiquidText({ children }: { children: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const words = children.split(" ");

  return (
    <div 
      className="inline-flex flex-wrap justify-center gap-x-4 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex overflow-hidden py-2">
          {word.split("").map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className="inline-block text-5xl md:text-7xl font-black text-gray-900"
              animate={isHovered ? {
                y: [0, -20, 10, -5, 0],
                rotate: [0, -10, 10, -5, 0],
                scaleY: [1, 1.4, 0.8, 1.1, 1],
                scaleX: [1, 0.8, 1.2, 0.9, 1],
                color: ["#111827", "#3b82f6", "#8b5cf6", "#3b82f6", "#111827"]
              } : {
                y: 0,
                rotate: 0,
                scaleY: 1,
                scaleX: 1,
                color: "#111827"
              }}
              transition={{
                duration: 0.8,
                delay: (wordIdx * 0.1) + (charIdx * 0.03),
                ease: "easeInOut"
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
}

const directions = [
  { initial: { opacity: 0, x: -200, rotate: -20, scale: 0.5 }, animate: { opacity: 1, x: 0, rotate: 0, scale: 1 } },
  { initial: { opacity: 0, x: 200, rotate: 20, scale: 0.5 }, animate: { opacity: 1, x: 0, rotate: 0, scale: 1 } },
  { initial: { opacity: 0, y: -200, rotateX: 90, scale: 0.8 }, animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 } },
  { initial: { opacity: 0, y: 200, rotateX: -90, scale: 0.8 }, animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 } },
  { initial: { opacity: 0, z: -500, rotateY: 180, scale: 0 }, animate: { opacity: 1, z: 0, rotateY: 0, scale: 1 } },
];

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const [animation] = useState(() => directions[Math.floor(Math.random() * directions.length)]);

  return (
    <motion.section
      ref={ref}
      initial={animation.initial}
      animate={isInView ? animation.animate : animation.initial}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 12,
        mass: 1,
        duration: 1.2
      }}
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden perspective-2000"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(0,0,0,0.03)_0%,_transparent_70%)]" />
      </div>
      {children}
    </motion.section>
  );
}

function Home() {
  const sections = [
    { title: "Vanshal Portfolio", content: "Building the future of web with motion and code.", color: "bg-white" },
    { title: "Creative Developer", content: "I transform complex ideas into elegant digital experiences.", color: "bg-gray-50" },
    { title: "Tech Stack", content: "React, TypeScript, Framer Motion, and GSAP mindset.", color: "bg-white" },
    { title: "My Projects", content: "Innovative solutions for modern problems.", color: "bg-gray-50" },
    { title: "Get In Touch", content: "Let's collaborate on your next big project.", color: "bg-black" },
  ];

  return (
    <main className="w-full bg-white selection:bg-blue-500 selection:text-white">
      {sections.map((section, index) => (
        <div key={index} className={`${section.color} ${section.color === "bg-black" ? "text-white" : "text-gray-900"}`}>
          <AnimatedSection>
            <div className="max-w-5xl text-center z-10">
              <div className="mb-8">
                <LiquidText>{section.title}</LiquidText>
              </div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={`text-xl md:text-3xl font-medium leading-relaxed opacity-80 ${section.color === "bg-black" ? "text-gray-300" : "text-gray-600"}`}
              >
                {section.content}
              </motion.p>
              {index === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="mt-12 animate-bounce"
                >
                  <span className="text-sm font-bold uppercase tracking-widest opacity-40">Scroll to explore</span>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        </div>
      ))}
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
