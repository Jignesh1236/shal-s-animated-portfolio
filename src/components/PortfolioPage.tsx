import heroImg from "@/assets/vansal-profile.jpg";
import { Reveal } from "@/components/Reveal";
import { MagnetButton } from "@/components/MagnetButton";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function PortfolioPage() {
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const heroImage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href =
      "https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;700&display=swap";
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
        delay: 0.2,
      });
    }

    // Reveal observer for any .reveal-up / .reveal-left / .reveal-right / .reveal-scale
    const els = document.querySelectorAll(
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale"
    );
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
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

  const splitText = (text: string) =>
    text.split("").map((c, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ whiteSpace: c === " " ? "pre" : "normal" }}
      >
        {c}
      </span>
    ));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{ background: "var(--gradient-radial)" }}
      />
      <div className="pointer-events-none fixed -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-accent/30 blur-[140px] parallax-slow" />
      <div className="pointer-events-none fixed -right-32 top-2/3 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[140px] parallax-slow" />

      {/* NAV */}
      <header className="fixed left-0 right-0 top-0 z-50 mix-blend-difference">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <a href="#top" className="text-display text-2xl tracking-tight text-foreground">
            VANSAL<span className="text-primary">.</span>
          </a>
          <div className="hidden gap-8 text-mono text-xs uppercase tracking-widest text-foreground md:flex">
            <a href="#about" className="hover:text-primary">About</a>
            <a href="#services" className="hover:text-primary">Services</a>
            <a href="#contact" className="hover:text-primary">Contact</a>
          </div>
          <a
            href="https://www.instagram.com/one.shal/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-foreground/40 px-4 py-2 text-mono text-xs uppercase tracking-widest text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            @one.shal
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative grain noise mx-auto max-w-7xl px-6 pb-24 pt-40 md:pt-48">
        <div className="grid items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-6 text-mono text-xs uppercase tracking-[0.3em] text-primary">
              [ Memer · Creator · Chaos Engineer ]
            </p>
            <h1
              ref={heroTitle}
              className="text-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] uppercase"
            >
              <span className="block">{splitText("Vansal")}</span>
              <span className="block gradient-text">{splitText("Nagrale")}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Crafting internet chaos, one meme at a time. 50M+ scrolls, infinite screenshots,
              zero apologies. Based in the timeline.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <MagnetButton className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="https://www.instagram.com/one.shal/" target="_blank" rel="noopener noreferrer">
                  Follow on Instagram →
                </a>
              </MagnetButton>
              <MagnetButton className="border border-foreground/30 bg-transparent text-foreground hover:border-primary">
                <a href="#contact">Collab with me</a>
              </MagnetButton>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div ref={heroImage} className="relative overflow-hidden rounded-3xl brutal">
              <img
                src={heroImg}
                alt="Vansal Nagrale portrait"
                width={1080}
                height={1080}
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-mono text-xs uppercase">
                <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">live</span>
                <span className="text-foreground/80">est. 2020</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border bg-primary py-6 text-primary-foreground overflow-hidden">
        <div className="flex whitespace-nowrap text-display text-5xl uppercase marquee md:text-7xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-12 pr-12">
              {["Memes", "★", "Reels", "★", "Reactions", "★", "Vibes", "★", "Chaos", "★", "Memes", "★", "Reels", "★"].map(
                (w, i) => (
                  <span key={i}>{w}</span>
                )
              )}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { n: "850K+", l: "Followers" },
            { n: "50M+", l: "Total Views" },
            { n: "1.2K", l: "Memes Dropped" },
            { n: "0", l: "F's Given" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 80}>
              <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary">
                <div className="text-display text-5xl text-primary md:text-6xl">{s.n}</div>
                <div className="mt-2 text-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5 reveal-left">
            <p className="text-mono text-xs uppercase tracking-[0.3em] text-accent">About</p>
            <h2 className="mt-3 text-display text-6xl uppercase md:text-8xl">
              I make<br /> the <span className="gradient-text">internet</span><br /> laugh.
            </h2>
          </div>
          <div className="md:col-span-7 reveal-right">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm <span className="text-foreground">Vansal Nagrale</span> — a memer who turned
                doom-scrolling into a full time profession. Started posting in 2020. Haven't
                stopped since.
              </p>
              <p>
                My work lives where Bollywood drama collides with Gen Z absurdism, with a sprinkle
                of "wait, did he really post that?". Brands trust me. Aunties block me. The
                algorithm loves me. Beautiful balance.
              </p>
              <div className="flex flex-wrap gap-3 pt-6">
                {["Brand Collabs", "Reels", "Meme Pages", "Voiceovers", "Roasting", "Reaction Edits"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-4 py-2 text-mono text-xs uppercase tracking-widest text-foreground hover:border-primary hover:text-primary"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="mb-12">
            <p className="text-mono text-xs uppercase tracking-[0.3em] text-accent">What I do</p>
            <h2 className="mt-3 text-display text-6xl uppercase md:text-8xl">
              Services<span className="text-primary">.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { t: "Brand Collabs", d: "Native meme integrations that actually convert. No cringe scripts." },
            { t: "Reels & Shorts", d: "Short-form chaos engineered for the algorithm." },
            { t: "Meme Pages", d: "Daily drops, community building, run the page like a studio." },
            { t: "Voiceovers", d: "That voice from your fyp. Dubbing, narration, character bits." },
            { t: "Roast Edits", d: "Reactions, roasts, montages — sharp cuts, sharper takes." },
            { t: "Consulting", d: "Helping creators & brands talk like a human on the internet." },
          ].map((s, i) => (
            <div key={s.t} className="reveal-scale" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary hover:-translate-y-2">
                <div className="text-mono text-xs text-primary">0{i + 1}</div>
                <h3 className="mt-4 text-display text-3xl uppercase">{s.t}</h3>
                <p className="mt-3 text-muted-foreground">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-7xl px-6 py-32">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-20 relative">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ background: "var(--gradient-meme)" }}
            />
            <div className="relative">
              <p className="text-mono text-xs uppercase tracking-[0.3em] text-primary-foreground/80">
                Got a brief?
              </p>
              <h2 className="mt-4 text-display text-6xl uppercase text-foreground md:text-9xl">
                Let's<br /> make<br /> it <span className="gradient-text">viral</span>.
              </h2>
              <p className="mt-8 max-w-xl text-lg text-muted-foreground">
                Slide into the DMs. Brand briefs, collabs, ya bas hi pe roast karwana ho —
                Instagram is the only address.
              </p>
              <div className="mt-10">
                <a
                  href="https://www.instagram.com/one.shal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 rounded-full bg-primary px-8 py-5 text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_60px_oklch(0.92_0.22_102/0.6)]"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  <span className="text-display text-2xl uppercase tracking-wide">@one.shal</span>
                  <span className="text-2xl transition-transform group-hover:translate-x-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-mono text-xs uppercase tracking-widest text-muted-foreground md:flex-row">
          <span>© 2026 Vansal Nagrale</span>
          <span>Designed loud · Coded louder</span>
          <span>Made with chaos in IN</span>
        </div>
      </footer>
    </div>
  );
}
