import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const queryClient = new QueryClient();

const directions = [
  { initial: { opacity: 0, x: -150, scale: 0.7, rotate: -15 }, animate: { opacity: 1, x: 0, scale: 1, rotate: 0 } }, // From Left
  { initial: { opacity: 0, x: 150, scale: 0.7, rotate: 15 }, animate: { opacity: 1, x: 0, scale: 1, rotate: 0 } },  // From Right
  { initial: { opacity: 0, y: -150, scale: 0.8, rotateX: 45 }, animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 } }, // From Top
  { initial: { opacity: 0, y: 150, scale: 0.8, rotateX: -45 }, animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 } }, // From Bottom
  { initial: { opacity: 0, scale: 0.3, rotate: 180 }, animate: { opacity: 1, scale: 1, rotate: 0 } }, // Spin In
  { initial: { opacity: 0, scale: 1.5, filter: "blur(10px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" } }, // Zoom Out Blur
];

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });
  
  const animationProps = useRef({
    direction: directions[Math.floor(Math.random() * directions.length)],
    duration: 0.8 + Math.random() * 0.7,
    delay: Math.random() * 0.3,
    spring: { type: "spring", stiffness: 50, damping: 15 }
  });

  return (
    <motion.div
      ref={ref}
      initial={animationProps.current.direction.initial}
      animate={isInView ? animationProps.current.direction.animate : animationProps.current.direction.initial}
      transition={{ 
        ...animationProps.current.spring,
        duration: animationProps.current.duration, 
        delay: animationProps.current.delay,
      }}
      className="min-h-[80vh] flex items-center justify-center p-8 relative overflow-hidden perspective-1000"
    >
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-100/20 via-transparent to-transparent" />
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className="w-full flex justify-center"
      >
        {children}
      </motion.div>
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
              <h2 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight hover-liquid cursor-default">
                {section.title}
              </h2>
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
