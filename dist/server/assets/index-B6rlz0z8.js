import { jsx, jsxs } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
const heroImg = "/assets/vansal-profile-DA1ElSP4.jpg";
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return /* @__PURE__ */ jsx("div", { ref, className: `reveal-up ${className}`, children });
}
function MagnetButton({
  children,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      ref,
      onMouseMove: onMove,
      onMouseLeave: onLeave,
      className: `magnet inline-flex items-center gap-3 rounded-full px-8 py-4 text-display text-lg uppercase tracking-wider ${className}`,
      ...rest,
      children
    }
  );
}
function PortfolioPage() {
  const heroTitle = useRef(null);
  const heroImage = useRef(null);
  useEffect(() => {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap";
    document.head.appendChild(fonts);
    if (heroTitle.current) {
      const chars = heroTitle.current.querySelectorAll(".char");
      gsap.from(chars, {
        y: 200,
        opacity: 0,
        rotate: 12,
        stagger: 0.04,
        duration: 1.1,
        ease: "expo.out",
        delay: 0.2
      });
    }
    const els = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale"
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
    };
  }, []);
  const splitText = (text) => text.split("").map((c, i) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "char inline-block",
      style: { whiteSpace: c === " " ? "pre" : "normal" },
      children: c
    },
    i
  ));
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "pointer-events-none fixed inset-0 -z-10 opacity-60",
        style: { background: "var(--gradient-radial)" }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-accent/30 blur-[140px] parallax-slow" }),
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed -right-32 top-2/3 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[140px] parallax-slow" }),
    /* @__PURE__ */ jsx("header", { className: "fixed left-0 right-0 top-0 z-50 mix-blend-difference", children: /* @__PURE__ */ jsxs("nav", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-6", children: [
      /* @__PURE__ */ jsxs("a", { href: "#top", className: "text-display text-2xl tracking-tight text-foreground", children: [
        "VANSAL",
        /* @__PURE__ */ jsx("span", { className: "text-primary", children: "." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden gap-8 text-mono text-xs uppercase tracking-widest text-foreground md:flex", children: [
        /* @__PURE__ */ jsx("a", { href: "#about", className: "hover:text-primary", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: "#services", className: "hover:text-primary", children: "Services" }),
        /* @__PURE__ */ jsx("a", { href: "#contact", className: "hover:text-primary", children: "Contact" })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.instagram.com/one.shal/",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "rounded-full border border-foreground/40 px-4 py-2 text-mono text-xs uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary",
          children: "@one.shal"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { id: "top", className: "relative grain noise mx-auto max-w-7xl px-6 pb-24 pt-40 md:pt-48", children: /* @__PURE__ */ jsxs("div", { className: "grid items-end gap-12 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-7", children: [
        /* @__PURE__ */ jsx("p", { className: "mb-6 text-mono text-xs uppercase tracking-[0.3em] text-primary", children: "[ Memer · Creator · Chaos Engineer ]" }),
        /* @__PURE__ */ jsxs(
          "h1",
          {
            ref: heroTitle,
            className: "text-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] uppercase",
            children: [
              /* @__PURE__ */ jsx("span", { className: "block", children: splitText("Vansal") }),
              /* @__PURE__ */ jsx("span", { className: "block gradient-text", children: splitText("Nagrale") })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-8 max-w-xl text-lg text-muted-foreground", children: "Crafting internet chaos, one meme at a time. 50M+ scrolls, infinite screenshots, zero apologies. Based in the timeline." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsx(MagnetButton, { className: "bg-primary text-primary-foreground hover:bg-primary/90", children: /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/one.shal/", target: "_blank", rel: "noopener noreferrer", children: "Follow on Instagram →" }) }),
          /* @__PURE__ */ jsx(MagnetButton, { className: "border border-foreground/30 bg-transparent text-foreground hover:border-primary", children: /* @__PURE__ */ jsx("a", { href: "#contact", children: "Collab with me" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative md:col-span-5", children: /* @__PURE__ */ jsxs("div", { ref: heroImage, className: "relative overflow-hidden rounded-3xl brutal", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: heroImg,
            alt: "Vansal Nagrale portrait",
            width: 1080,
            height: 1080,
            className: "h-[520px] w-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono text-xs uppercase", children: [
          /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary px-3 py-1 text-primary-foreground", children: "live" }),
          /* @__PURE__ */ jsx("span", { className: "text-foreground/80", children: "est. 2020" })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "border-y border-border bg-primary py-6 text-primary-foreground overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "flex whitespace-nowrap text-display text-5xl uppercase marquee md:text-7xl", children: Array.from({ length: 2 }).map((_, k) => /* @__PURE__ */ jsx("div", { className: "flex shrink-0 items-center gap-12 pr-12", children: ["Memes", "★", "Reels", "★", "Reactions", "★", "Vibes", "★", "Chaos", "★", "Memes", "★", "Reels", "★"].map(
      (w, i) => /* @__PURE__ */ jsx("span", { children: w }, i)
    ) }, k)) }) }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-7xl px-6 py-24", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-6 md:grid-cols-4", children: [
      { n: "850K+", l: "Followers" },
      { n: "50M+", l: "Total Views" },
      { n: "1.2K", l: "Memes Dropped" },
      { n: "0", l: "F's Given" }
    ].map((s, i) => /* @__PURE__ */ jsx(Reveal, { delay: i * 80, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary", children: [
      /* @__PURE__ */ jsx("div", { className: "text-display text-5xl text-primary md:text-6xl", children: s.n }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 text-mono text-xs uppercase tracking-widest text-muted-foreground", children: s.l })
    ] }) }, s.l)) }) }),
    /* @__PURE__ */ jsx("section", { id: "about", className: "relative mx-auto max-w-7xl px-6 py-32", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 md:grid-cols-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-5 reveal-left", children: [
        /* @__PURE__ */ jsx("p", { className: "text-mono text-xs uppercase tracking-[0.3em] text-accent", children: "About" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-display text-6xl uppercase md:text-8xl", children: [
          "I make",
          /* @__PURE__ */ jsx("br", {}),
          " the ",
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "internet" }),
          /* @__PURE__ */ jsx("br", {}),
          " laugh."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:col-span-7 reveal-right", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 text-lg leading-relaxed text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "I'm ",
          /* @__PURE__ */ jsx("span", { className: "text-foreground", children: "Vansal Nagrale" }),
          " — a memer who turned doom-scrolling into a full time profession. Started posting in 2020. Haven't stopped since."
        ] }),
        /* @__PURE__ */ jsx("p", { children: 'My work lives where Bollywood drama collides with Gen Z absurdism, with a sprinkle of "wait, did he really post that?". Brands trust me. Aunties block me. The algorithm loves me. Beautiful balance.' }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 pt-6", children: ["Brand Collabs", "Reels", "Meme Pages", "Voiceovers", "Roasting", "Reaction Edits"].map(
          (t) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "rounded-full border border-border px-4 py-2 text-mono text-xs uppercase tracking-widest text-foreground hover:border-primary hover:text-primary",
              children: t
            },
            t
          )
        ) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { id: "services", className: "mx-auto max-w-7xl px-6 py-24", children: [
      /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsx("p", { className: "text-mono text-xs uppercase tracking-[0.3em] text-accent", children: "What I do" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-3 text-display text-6xl uppercase md:text-8xl", children: [
          "Services",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: [
        { t: "Brand Collabs", d: "Native meme integrations that actually convert. No cringe scripts." },
        { t: "Reels & Shorts", d: "Short-form chaos engineered for the algorithm." },
        { t: "Meme Pages", d: "Daily drops, community building, run the page like a studio." },
        { t: "Voiceovers", d: "That voice from your fyp. Dubbing, narration, character bits." },
        { t: "Roast Edits", d: "Reactions, roasts, montages — sharp cuts, sharper takes." },
        { t: "Consulting", d: "Helping creators & brands talk like a human on the internet." }
      ].map((s, i) => /* @__PURE__ */ jsx("div", { className: "reveal-scale", style: { transitionDelay: `${i * 80}ms` }, children: /* @__PURE__ */ jsxs("div", { className: "group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary hover:-translate-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-mono text-xs text-primary", children: [
          "0",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-display text-3xl uppercase", children: s.t }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-muted-foreground", children: s.d })
      ] }) }, s.t)) })
    ] }),
    /* @__PURE__ */ jsx("section", { id: "contact", className: "relative mx-auto max-w-7xl px-6 py-32", children: /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-20 relative", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "pointer-events-none absolute inset-0 opacity-30",
          style: { background: "var(--gradient-meme)" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("p", { className: "text-mono text-xs uppercase tracking-[0.3em] text-primary-foreground/80", children: "Got a brief?" }),
        /* @__PURE__ */ jsxs("h2", { className: "mt-4 text-display text-6xl uppercase text-foreground md:text-9xl", children: [
          "Let's",
          /* @__PURE__ */ jsx("br", {}),
          " make",
          /* @__PURE__ */ jsx("br", {}),
          " it ",
          /* @__PURE__ */ jsx("span", { className: "gradient-text", children: "viral" }),
          "."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-8 max-w-xl text-lg text-muted-foreground", children: "Slide into the DMs. Brand briefs, collabs, ya bas hi pe roast karwana ho — Instagram is the only address." }),
        /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://www.instagram.com/one.shal/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "group inline-flex items-center gap-4 rounded-full bg-primary px-8 py-5 text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_60px_oklch(0.92_0.22_102/0.6)]",
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5" }),
                /* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
                /* @__PURE__ */ jsx("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-display text-2xl uppercase tracking-wide", children: "@one.shal" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl transition-transform group-hover:translate-x-2", children: "→" })
            ]
          }
        ) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-mono text-xs uppercase tracking-widest text-muted-foreground md:flex-row", children: [
      /* @__PURE__ */ jsx("span", { children: "© 2026 Vansal Nagrale" }),
      /* @__PURE__ */ jsx("span", { children: "Designed loud · Coded louder" }),
      /* @__PURE__ */ jsx("span", { children: "Made with chaos in IN" })
    ] }) })
  ] });
}
const SplitComponent = PortfolioPage;
export {
  SplitComponent as component
};
