import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const queryClient = new QueryClient();

const directions = [
  { initial: { opacity: 0, x: -100, scale: 0.8, rotate: -5 }, animate: { opacity: 1, x: 0, scale: 1, rotate: 0 } },
  { initial: { opacity: 0, x: 100, scale: 0.8, rotate: 5 }, animate: { opacity: 1, x: 0, scale: 1, rotate: 0 } },
  { initial: { opacity: 0, y: -100, scale: 0.9, rotate: -2 }, animate: { opacity: 1, y: 0, scale: 1, rotate: 0 } },
  { initial: { opacity: 0, y: 100, scale: 0.9, rotate: 2 }, animate: { opacity: 1, y: 0, scale: 1, rotate: 0 } },
  { initial: { opacity: 0, scale: 0.5, rotate: -10 }, animate: { opacity: 1, scale: 1, rotate: 0 } }, // Zoom in
];

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  // Pick a random direction and random transition delay/duration for more variety
  const animationProps = useRef({
    direction: directions[Math.floor(Math.random() * directions.length)],
    duration: 0.6 + Math.random() * 0.6,
    delay: Math.random() * 0.2
  });

  return (
    <motion.div
      ref={ref}
      initial={animationProps.current.direction.initial}
      animate={isInView ? animationProps.current.direction.animate : animationProps.current.direction.initial}
      transition={{ 
        duration: animationProps.current.duration, 
        delay: animationProps.current.delay,
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smoother feel
      }}
      className="min-h-[75vh] flex items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Subtle background decoration to enhance the "random" feel */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-gray-200 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>
      
      {children}
    </motion.div>
  );
}

function Home() {
  const sections = [
    { title: "Welcome to My Portfolio", content: "I am a creative developer passionate about building beautiful experiences.", color: "bg-white" },
    { title: "About Me", content: "I love solving complex problems with simple solutions.", color: "bg-gray-50" },
    { title: "My Projects", content: "Check out some of the cool things I've built recently.", color: "bg-white" },
    { title: "My Skills", content: "React, TypeScript, Tailwind, and more.", color: "bg-gray-50" },
    { title: "Experience", content: "Working with modern web technologies for over 5 years.", color: "bg-white" },
    { title: "Contact Me", content: "Let's work together on something amazing!", color: "bg-gray-50" },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {sections.map((section, index) => (
        <div key={index} className={section.color}>
          <AnimatedSection>
            <div className="max-w-2xl text-center">
              <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">{section.title}</h2>
              <p className="text-xl text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          </AnimatedSection>
        </div>
      ))}
    </div>
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
