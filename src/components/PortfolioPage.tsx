import heroImg from "@/assets/hero-vansal.jpg";
import meme1 from "@/assets/meme-1.jpg";
import meme2 from "@/assets/meme-2.jpg";
import meme3 from "@/assets/meme-3.jpg";
import meme4 from "@/assets/meme-4.jpg";
import meme5 from "@/assets/meme-5.jpg";
import meme6 from "@/assets/meme-6.jpg";
import { Cursor } from "@/components/Cursor";
import { Reveal } from "@/components/Reveal";
import { MagnetButton } from "@/components/MagnetButton";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const memes = [
  { src: meme1, title: "Findan Street", tag: "Reaction", views: "2.4M" },
  { src: meme2, title: "Office Cat CEO", tag: "Surreal", views: "1.8M" },
  { src: meme3, title: "Bollywood Drama", tag: "Filmi", views: "5.1M" },
  { src: meme4, title: "Coding Doggo", tag: "Relatable", views: "3.3M" },
  { src: meme5, title: "Phone Army", tag: "Pop", views: "910K" },
  { src: meme6, title: "Late Night Scroll", tag: "Mood", views: "1.2M" },
];

export function PortfolioPage() {
  const heroTitle = useRef<HTMLHeadingElement>(null);

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
        delay: 0.2,
      });
    }
  }, []);

  const splitText = (text: string) =>
    text.split("").map((c, i) => (
      <span key={i} className="char inline-block" style={{ whiteSpace: c === " " ? "pre" : "normal" }}>
        {c}
      </span>
    ));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Cursor />

      {/* Ambient gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-radial)" }} />
      <div className="pointer-events-none fixed -left-32 top-1/3 -z-10 h-96 w-96 rounded-full bg-accent/30 blur-[140px]" />
      <div className="pointer-events-none fixed -right-32 top-2/3 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />

      {/* NAV */}
      <header className="fixed left-0 right-0 top-0 z-50 mix-blend-difference">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <a href="#top" className="text-display text-2xl tracking-tight text-foreground">
            VANSAL<span className="text-primary">.</span>
          </a>
          <div className="hidden gap-8 text-mono text-xs uppercase tracking-widest text-foreground md:flex">
            <a href="#work" className="hover:text-primary">Work</a>
            <a href="#about" className="hover:text-primary">About</a>
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
                See the work →
              </MagnetButton>
              <MagnetButton className="border border-foreground/30 bg-transparent text-foreground hover:border-primary">
                Collab with me
              </MagnetButton>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="img-distort relative overflow-hidden rounded-3xl brutal">
              <img
                src={heroImg}
                alt="Vansal Nagrale portrait"
                width={1280}
                height={1600}
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
                <div className="mt-2 text-mono text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="text-mono text-xs uppercase tracking-[0.3em] text-accent">Selected Work</p>
              <h2 className="mt-3 text-display text-6xl uppercase md:text-8xl">
                Greatest <span className="gradient-text">Hits</span>
              </h2>
            </div>
            <span className="hidden text-mono text-sm text-muted-foreground md:block">
              [ scroll for chaos ]
            </span>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {memes.map((m, i) => (
            <Reveal key={m.title} delay={i * 100}>
              <article className="img-distort group relative overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={m.src}
                    alt={m.title}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center justify-between text-mono text-xs uppercase tracking-widest text-primary">
                    <span>{m.tag}</span>
                    <span>{m.views} views</span>
                  </div>
                  <h3 className="mt-2 text-display text-3xl uppercase">{m.title}</h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="text-mono text-xs uppercase tracking-[0.3em] text-accent">About</p>
            <h2 className="mt-3 text-display text-6xl uppercase md:text-8xl">
              I make<br /> the <span className="gradient-text">internet</span><br /> laugh.
            </h2>
          </Reveal>
          <Reveal delay={150} className="md:col-span-7">
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm <span className="text-foreground">Vansal Nagrale</span> — a memer who turned doom-scrolling
                into a full time profession. Started posting in 2020. Haven't stopped since.
              </p>
              <p>
                My work lives where Bollywood drama collides with Gen Z absurdism, with a sprinkle of
                "wait, did he really post that?". Brands trust me. Aunties block me. The algorithm
                loves me. Beautiful balance.
              </p>
              <div className="flex flex-wrap gap-3 pt-6">
                {["Brand Collabs", "Reels", "Meme Pages", "Voiceovers", "Roasting", "Reaction Edits"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-4 py-2 text-mono text-xs uppercase tracking-widest text-foreground hover:border-primary hover:text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-7xl px-6 py-32">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-20 relative">
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "var(--gradient-meme)" }} />
            <div className="relative">
              <p className="text-mono text-xs uppercase tracking-[0.3em] text-primary-foreground/80">Got a brief?</p>
              <h2 className="mt-4 text-display text-6xl uppercase text-foreground md:text-9xl">
                Let's<br /> make<br /> it <span className="gradient-text">viral</span>.
              </h2>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <MagnetButton className="bg-foreground text-background hover:opacity-90">
                  vansal@meme.co →
                </MagnetButton>
                <a
                  href="https://www.instagram.com/one.shal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mono text-sm uppercase tracking-widest text-foreground hover:text-primary"
                >
                  → @one.shal on Instagram
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
