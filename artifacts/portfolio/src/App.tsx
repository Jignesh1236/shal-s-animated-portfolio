import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const queryClient = new QueryClient();

const directions = [
  { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 } }, // From Left
  { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0 } },  // From Right
  { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0 } }, // From Top
  { initial: { opacity: 0, y: 100 }, animate: { opacity: 1, y: 0 } },  // From Bottom
];

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  // Pick a random direction on each mount (or we could make it stable with useMemo)
  const directionRef = useRef(directions[Math.floor(Math.random() * directions.length)]);

  return (
    <motion.div
      ref={ref}
      initial={directionRef.current.initial}
      animate={isInView ? directionRef.current.animate : directionRef.current.initial}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-[70vh] flex items-center justify-center p-8 border-b border-gray-100"
    >
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
