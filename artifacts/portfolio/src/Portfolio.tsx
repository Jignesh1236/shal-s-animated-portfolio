import { useEffect } from 'react';
import './portfolio.css';

declare const gsap: any;
declare const anime: any;
declare const Shery: any;

// Random direction helper — picks from top/bottom/left/right/diagonals
function rndDir(mag = 60) {
  const pool = [
    { x: 0,    y: mag  },  // bottom
    { x: 0,    y: -mag },  // top
    { x: -mag, y: 0    },  // left
    { x: mag,  y: 0    },  // right
    { x: -mag * 0.7, y: -mag * 0.7 },
    { x:  mag * 0.7, y: -mag * 0.7 },
    { x: -mag * 0.7, y:  mag * 0.7 },
    { x:  mag * 0.7, y:  mag * 0.7 },
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function Portfolio() {
  useEffect(() => {
    const LABELS = ['Hero', 'About', 'Memes', 'Vibes', 'Connect'];
    const N = 5;
    let cur = 0;
    let locked = false;

    const track  = document.getElementById('track')!;
    const dots   = document.querySelectorAll<HTMLElement>('.dot');
    const plabel = document.getElementById('plabel')!;
    const bar    = document.getElementById('bar')!;
    const curEl  = document.getElementById('cur')!;
    const ringEl = document.getElementById('cur-ring')!;

    // ── BUILD LIQUID HERO NAME ──────────────────────────
    const heroName = document.getElementById('heroName')!;
    heroName.innerHTML = '';
    'Vanshal.'.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'p1-char';
      span.textContent = ch === ' ' ? '\u00a0' : ch;
      heroName.appendChild(span);
    });

    const chars = document.querySelectorAll<HTMLElement>('.p1-char');
    let mouseX = 0, mouseY = 0;
    const charData = Array.from(chars).map(el => ({
      el, ox: 0, oy: 0, vx: 0, vy: 0
    }));

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', onMouseMove);

    let liquidRAF = 0;
    function liquidTick() {
      charData.forEach(c => {
        const rect   = c.el.getBoundingClientRect();
        const charCX = rect.left + rect.width  / 2;
        const charCY = rect.top  + rect.height / 2;
        const dx   = mouseX - charCX;
        const dy   = mouseY - charCY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 160;

        if (dist < radius && dist > 0) {
          const force    = (radius - dist) / radius;
          const strength = force * force * 28;
          c.vx += ((dx / dist) * strength - c.ox) * 0.18;
          c.vy += ((dy / dist) * strength - c.oy) * 0.18;
        } else {
          c.vx += (0 - c.ox) * 0.1;
          c.vy += (0 - c.oy) * 0.1;
        }

        c.vx *= 0.72; c.vy *= 0.72;
        c.ox += c.vx;  c.oy += c.vy;

        gsap.set(c.el, {
          x: c.ox, y: c.oy,
          skewX:  c.vx * 0.45,
          scaleY: 1 - Math.abs(c.vy) * 0.008,
        });
      });
      liquidRAF = requestAnimationFrame(liquidTick);
    }
    liquidTick();

    const onNameMove = () => {
      charData.forEach((c, i) => {
        gsap.to(c.el, {
          color: Math.random() > 0.6 ? 'var(--lime)' : 'var(--text)',
          duration: 0.25 + i * 0.02, ease: 'power2.out',
        });
      });
    };
    const onNameLeave = () => gsap.to(chars, { color: 'var(--text)', duration: 0.5 });
    heroName.addEventListener('mousemove', onNameMove);
    heroName.addEventListener('mouseleave', onNameLeave);

    // ── CURSOR — diamond dot + rotating square ring ────────
    let cx = 0, cy = 0, rx = 0, ry = 0, rRot = 0;
    const onCurMove = (e: MouseEvent) => {
      cx = e.clientX; cy = e.clientY;
      gsap.set(curEl, { x: cx, y: cy });
    };
    document.addEventListener('mousemove', onCurMove);

    let ringRAF = 0;
    function tickRing() {
      rx += (cx - rx) * 0.09;
      ry += (cy - ry) * 0.09;
      rRot += 0.8;
      gsap.set(ringEl, { x: rx, y: ry, rotation: rRot });
      ringRAF = requestAnimationFrame(tickRing);
    }
    tickRing();

    function regHover(els: NodeListOf<Element> | Element[]) {
      els.forEach(el => {
        el.addEventListener('mouseenter', () => {
          gsap.to(ringEl, { scale: 1.8, opacity: 1, duration: .3, ease: 'power2.out' });
          gsap.to(curEl,  { scale: 0, duration: .2 });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(ringEl, { scale: 1, opacity: 0.7, duration: .3, ease: 'power2.inOut' });
          gsap.to(curEl,  { scale: 1, duration: .2 });
        });
      });
    }
    regHover(document.querySelectorAll('a, .dot, .meme-card'));

    // ── NAVIGATION ───────────────────────────────────────
    function go(idx: number) {
      if (idx < 0 || idx >= N || locked || idx === cur) return;
      locked = true;
      cur = idx;

      gsap.to(track, {
        x: -cur * window.innerWidth,
        duration: .9, ease: 'power3.inOut',
        onComplete() { locked = false; enter(cur); }
      });

      gsap.to(bar, { scaleX: cur / (N - 1), duration: .6, ease: 'power2.out' });
      dots.forEach((d, i) => d.classList.toggle('on', i === cur));
      gsap.to(plabel, { y: -6, opacity: 0, duration: .15,
        onComplete() {
          plabel.textContent = LABELS[cur];
          gsap.to(plabel, { y: 0, opacity: 1, duration: .25 });
        }
      });
    }

    // ── INPUT ────────────────────────────────────────────
    let wAcc = 0, wT: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked) return;
      wAcc += Math.abs(e.deltaY);
      if (wT) clearTimeout(wT);
      wT = setTimeout(() => { wAcc = 0; }, 250);
      if (wAcc >= 70) { wAcc = 0; go(e.deltaY > 0 ? cur + 1 : cur - 1); }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(cur + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(cur - 1);
    };
    window.addEventListener('keydown', onKey);

    let tx = 0, ty = 0;
    const onTS = (e: TouchEvent) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; };
    const onTE = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx;
      const dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > Math.abs(dy)) { if (dx < -40) go(cur+1); if (dx > 40) go(cur-1); }
      else { if (dy < -40) go(cur+1); if (dy > 40) go(cur-1); }
    };
    window.addEventListener('touchstart', onTS, { passive: true });
    window.addEventListener('touchend',   onTE, { passive: true });

    dots.forEach(d => d.addEventListener('click', () => go(+(d.dataset.i ?? 0))));
    const onResize = () => gsap.set(track, { x: -cur * window.innerWidth });
    window.addEventListener('resize', onResize);

    // ── PANEL ANIMATIONS — all randomised directions ──────
    function enter(i: number) {
      if (i === 0) enterHero();
      if (i === 1) enterAbout();
      if (i === 2) enterMemes();
      if (i === 3) enterVibes();
      if (i === 4) enterConnect();
    }

    function enterHero() {
      gsap.to('.p1-char',  { y: 0, duration: 1.0, ease: 'power4.out', stagger: 0.04, delay: 0.1 });
      gsap.to('.p1-tag',   { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'power3.inOut', delay: .05 });
      const d1 = rndDir(18);
      gsap.to('.p1-sub',   { opacity: 1, x: 0, y: 0, duration: .6, delay: .5, ease: 'power3.out' });
      gsap.set('.p1-sub',  { opacity: 0, x: d1.x, y: d1.y });
      const d2 = rndDir(20);
      gsap.to('.p1-ig',    { opacity: 1, x: 0, y: 0, duration: .5, delay: .65, ease: 'power3.out' });
      gsap.set('.p1-ig',   { opacity: 0, x: d2.x, y: d2.y });
      gsap.to('.p1-line',  { scaleX: 1, duration: 1.2, ease: 'expo.inOut', delay: .1 });
      gsap.to('.p1-ghost', { opacity: 1, x: 0, duration: 1.0, ease: 'expo.out', delay: .2 });
    }

    function enterAbout() {
      const dTag  = rndDir(28);
      const dHead = rndDir(40);
      const dBody = rndDir(24);

      gsap.set('.p2-tag',      { opacity: 0, x: dTag.x,  y: dTag.y  });
      gsap.set('.p2-headline', { opacity: 0, x: dHead.x, y: dHead.y });
      gsap.set('.p2-body',     { opacity: 0, x: dBody.x, y: dBody.y });

      gsap.to('.p2-tag',      { opacity: 1, x: 0, y: 0, duration: .55, ease: 'power3.out' });
      gsap.to('.p2-headline', { opacity: 1, x: 0, y: 0, duration: .7,  ease: 'power3.out', delay: .12 });
      gsap.to('.p2-body',     { opacity: 1, x: 0, y: 0, duration: .55, ease: 'power3.out', delay: .26 });

      // Stats each fly in from a random unique direction
      document.querySelectorAll('.p2-stat-num').forEach((el, i) => {
        const d = rndDir(50);
        gsap.set(el, { opacity: 0, x: d.x, y: d.y, scale: .75 });
        gsap.to(el,  { opacity: 1, x: 0, y: 0, scale: 1, duration: .6, ease: 'back.out(1.6)', delay: .2 + i * .1 });
      });
      document.querySelectorAll('.p2-stat-lbl').forEach((el, i) => {
        gsap.to(el, { opacity: 1, duration: .4, delay: .38 + i * .1 });
      });
      setTimeout(countUp, 420);
    }

    function countUp() {
      ([['c1', 2847, '+'], ['c2', 3200, '+'], ['c3', 100, '%']] as [string, number, string][]).forEach(([id, val, sfx]) => {
        const el = document.getElementById(id);
        if (!el) return;
        anime({ targets: { v: 0 }, v: val, duration: 1600, easing: 'easeOutExpo',
          update: (a: any) => { el.textContent = Math.floor(a.animations[0].currentValue) + sfx; }
        });
      });
    }

    function enterMemes() {
      gsap.to('.p3-title', { clipPath: 'inset(0 0% 0 0)', duration: .7, ease: 'power3.inOut' });
      const ds = rndDir(20);
      gsap.set('.p3-src', { opacity: 0, x: ds.x, y: ds.y });
      gsap.to('.p3-src',  { opacity: 1, x: 0, y: 0, duration: .45, delay: .3 });

      const cards = document.querySelectorAll('.meme-card');
      cards.forEach((card, i) => {
        const d   = rndDir(280);
        const rot = (Math.random() - 0.5) * 30;
        // set → to is more reliable than fromTo on freshly-created nodes
        gsap.set(card, { opacity: 0, x: d.x, y: d.y, rotation: rot, scale: 0.65 });
        gsap.to(card,  { opacity: 1, x: 0,   y: 0,   rotation: 0,   scale: 1,
          duration: 0.7, ease: 'power3.out', delay: 0.05 * i });
      });
    }

    let tickerAnim: any = null;
    function enterVibes() {
      const ticker = document.getElementById('ticker')!;
      const w = ticker.scrollWidth / 2;
      if (tickerAnim) tickerAnim.pause();
      gsap.set(ticker, { x: 0 });
      tickerAnim = gsap.to(ticker, {
        x: -w, duration: w / 80, ease: 'none', repeat: -1,
        modifiers: { x: (x: string) => (parseFloat(x) % w) + 'px' }
      });

      document.querySelectorAll('.p4-card').forEach((c, i) => {
        const d = rndDir(48);
        gsap.set(c, { opacity: 0, x: d.x, y: d.y });
        gsap.to(c,  { opacity: 1, x: 0, y: 0, duration: .55, ease: 'power3.out', delay: .08 + i * .07 });
      });
    }

    function enterConnect() {
      const de = rndDir(20);
      gsap.set('.p5-eye', { opacity: 0, x: de.x, y: de.y });
      gsap.to('.p5-eye',  { opacity: 1, x: 0, y: 0, duration: .45, delay: .05 });

      // Words fly in from separate random directions
      document.querySelectorAll('.p5-word span').forEach((el, i) => {
        const d = rndDir(80);
        gsap.set(el, { y: d.y > 0 ? '110%' : '-110%', x: d.x * 0.4 });
        gsap.to(el,  { y: '0%', x: 0, duration: .85, ease: 'power4.out', delay: .1 + i * .12 });
      });

      const dl = rndDir(24);
      gsap.set('.p5-links', { opacity: 0, x: dl.x, y: dl.y });
      gsap.to('.p5-links',  { opacity: 1, x: 0, y: 0, duration: .5, delay: .55 });
      gsap.to('.p5-ghost',  { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out', delay: .2 });
    }

    // ── INITIAL GSAP STATES ──────────────────────────────
    gsap.set('.p1-char',              { y: '105%' });
    gsap.set('.p1-tag',               { clipPath: 'inset(0 100% 0 0)' });
    gsap.set('.p1-sub, .p1-ig',       { opacity: 0 });
    gsap.set('.p1-ghost',             { opacity: 0, x: 30 });
    gsap.set('.p1-line',              { scaleX: 0 });
    gsap.set('.p2-tag',               { opacity: 0 });
    gsap.set('.p2-headline',          { opacity: 0 });
    gsap.set('.p2-body',              { opacity: 0 });
    gsap.set('.p2-stat-num',          { opacity: 0, scale: .8 });
    gsap.set('.p2-stat-lbl',          { opacity: 0 });
    gsap.set('.p3-title',             { clipPath: 'inset(0 100% 0 0)' });
    gsap.set('.p3-src',               { opacity: 0 });
    gsap.set('.p4-card',              { opacity: 0 });
    gsap.set('.p5-eye',               { opacity: 0 });
    gsap.set('.p5-hl .p5-word span',  { y: '110%' });
    gsap.set('.p5-links',             { opacity: 0 });
    gsap.set('.p5-ghost',             { opacity: 0, y: 30 });
    gsap.set(bar,                     { scaleX: 0 });
    gsap.set(ringEl,                  { opacity: 0.7 });

    // ── REDDIT API ────────────────────────────────────────
    // Try multiple URL formats + proxy chain
    const USER = 'MasterpieceIll7317';
    const URLS = [
      `https://www.reddit.com/user/${USER}/submitted.json?limit=100&sort=new`,
      `https://www.reddit.com/user/${USER}/overview.json?limit=100`,
    ];

    async function tryProxy(redditUrl: string): Promise<any> {
      // Proxy 1: allorigins
      try {
        const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(redditUrl)}&t=${Date.now()}`);
        if (r.ok) {
          const j = await r.json();
          const parsed = JSON.parse(j.contents);
          if (parsed?.data?.children?.length) return parsed;
        }
      } catch (_) {}

      // Proxy 2: corsproxy.io  
      try {
        const r = await fetch(`https://corsproxy.io/?${redditUrl}`);
        if (r.ok) {
          const parsed = await r.json();
          if (parsed?.data?.children?.length) return parsed;
        }
      } catch (_) {}

      // Proxy 3: codetabs
      try {
        const r = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(redditUrl)}`);
        if (r.ok) {
          const parsed = await r.json();
          if (parsed?.data?.children?.length) return parsed;
        }
      } catch (_) {}

      return null;
    }

    function extractImageUrl(p: any): string {
      // 1. Gallery — grab first item
      if (p.is_gallery && p.media_metadata) {
        const first = Object.values(p.media_metadata)[0] as any;
        if (first?.s?.u) return first.s.u.replace(/&amp;/g, '&');
        if (first?.s?.gif) return first.s.gif.replace(/&amp;/g, '&');
      }
      // 2. Preview image
      if (p.preview?.images?.[0]?.source?.url) {
        return p.preview.images[0].source.url.replace(/&amp;/g, '&');
      }
      // 3. Direct URL
      const url = p.url_overridden_by_dest || p.url || '';
      if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url)) return url;
      if (url.includes('i.redd.it') || url.includes('i.imgur.com')) return url;
      return '';
    }

    async function loadMemes() {
      const grid = document.getElementById('mgrid')!;
      let data: any = null;

      for (const url of URLS) {
        data = await tryProxy(url);
        if (data) break;
      }

      try {
        if (!data) throw new Error('no data');
        const posts = (data.data.children as any[])
          .map((c: any) => c.data)
          .filter((p: any) => !p.over_18)
          .map((p: any) => ({
            url: extractImageUrl(p),
            title: p.title,
            permalink: 'https://reddit.com' + p.permalink,
          }))
          .filter((p: any) => p.url)
          .sort(() => Math.random() - 0.5)
          .slice(0, 8);

        if (!posts.length) throw new Error('no image posts found');

        grid.innerHTML = '';
        posts.forEach((post: any) => {
          const card = document.createElement('div');
          card.className = 'meme-card';
          const img = document.createElement('img');
          img.className = 'images';
          img.src = post.url; img.alt = post.title;
          // no lazy — Shery needs natural dimensions immediately
          img.onerror = () => card.remove();
          const ov  = document.createElement('div'); ov.className = 'meme-ov';
          const ttl = document.createElement('div'); ttl.className = 'meme-ttl';
          ttl.textContent = post.title;
          ov.appendChild(ttl); card.appendChild(img); card.appendChild(ov);
          card.addEventListener('click', () => window.open(post.permalink, '_blank', 'noopener'));
          grid.appendChild(card);
        });
        regHover(document.querySelectorAll('.meme-card'));

        // Wait for every image to fully load, THEN init Shery
        const imgEls = Array.from(grid.querySelectorAll<HTMLImageElement>('img.images'));
        const loadPromises = imgEls.map(im =>
          im.complete
            ? Promise.resolve()
            : new Promise<void>(res => { im.onload = () => res(); im.onerror = () => res(); })
        );
        Promise.all(loadPromises).then(() => {
          try {
            if (typeof Shery !== 'undefined' && imgEls.length > 0) {
              Shery.imageEffect('.images', { style: 6, debug: true, gooey: true });
            }
          } catch (_) {}
        });

        if (cur === 2) enterMemes();
      } catch (_) {
        buildStaticMemes();
        if (cur === 2) enterMemes();
      }
    }

    function buildStaticMemes() {
      const grid = document.getElementById('mgrid')!;
      grid.innerHTML = '';
      const ALL_MEMES = [
        { emoji: '😭', line: 'Me explaining why I sent that meme at 3am', lime: 'No regrets.' },
        { emoji: '🧠', line: 'Using 0% of my brain at work', lime: '100% online though.' },
        { emoji: '💀', line: 'When the meme hits different at midnight', lime: 'Send tweet.' },
        { emoji: '🤡', line: 'My sleep schedule after one more scroll', lime: 'Chronically online.' },
        { emoji: '🔥', line: 'This meme is performing well in the group chat', lime: 'Very demure.' },
        { emoji: '👁️', line: 'Watching my friend not get the reference', lime: 'Stay blessed.' },
        { emoji: '😤', line: 'Nobody understands niche humor like I do', lime: 'Certified curator.' },
        { emoji: '🫠', line: 'Current brainrot level: maximum', lime: 'No thoughts.' },
        { emoji: '🗿', line: 'No thoughts. Head empty. Scroll continue.', lime: 'Certified stonks.' },
        { emoji: '☠️', line: 'POV: you opened twitter before breakfast', lime: 'Bad idea.' },
        { emoji: '🫡', line: 'Me respecting the meme chain in group chat', lime: 'Protocol followed.' },
        { emoji: '💅', line: 'I could explain the joke but it\'d ruin it', lime: 'Niche is life.' },
        { emoji: '🤌', line: 'This format is perfect. Do not change it.', lime: 'Chefs kiss.' },
        { emoji: '🧃', line: 'Brainrot is just culture at this point', lime: 'Fr no cap.' },
        { emoji: '🎭', line: 'Me switching personalities for different group chats', lime: 'Adapt or perish.' },
        { emoji: '🌙', line: '3am meme energy hits different', lime: 'Ungovernable.' },
      ];
      // shuffle and pick 8 for variety every load
      const memes = ALL_MEMES.sort(() => Math.random() - 0.5).slice(0, 8);
      memes.forEach((m) => {
        const card = document.createElement('div');
        card.className = 'meme-card';
        card.innerHTML = `
          <div class="meme-text-card">
            <div class="meme-emoji">${m.emoji}</div>
            <div class="meme-line">${m.line}</div>
            <div class="meme-line meme-lime">${m.lime}</div>
          </div>
          <div class="meme-ov"><div class="meme-ttl">${m.line}</div></div>`;
        grid.appendChild(card);
      });
      regHover(document.querySelectorAll('.meme-card'));
    }

    // ── BOOT ─────────────────────────────────────────────
    loadMemes();
    setTimeout(enterHero, 120);

    // ── CLEANUP ──────────────────────────────────────────
    return () => {
      cancelAnimationFrame(liquidRAF);
      cancelAnimationFrame(ringRAF);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onCurMove);
      heroName.removeEventListener('mousemove', onNameMove);
      heroName.removeEventListener('mouseleave', onNameLeave);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTS);
      window.removeEventListener('touchend', onTE);
      window.removeEventListener('resize', onResize);
      if (tickerAnim) tickerAnim.kill();
    };
  }, []);

  return (
    <>
      <div id="cur" />
      <div id="cur-ring" />
      <div id="bar" />

      <div id="wrap">
        <div id="track">

          {/* P1: HERO */}
          <section className="panel" id="p1">
            <div className="p1-ghost">MEMER</div>
            <div className="p1-line" />
            <p className="p1-tag">Portfolio &mdash; 2025</p>
            <h1 className="p1-name" id="heroName" />
            <p className="p1-sub">Creator of cursed content. Architect of chaotic humor. Chronically online since forever.</p>
            <a className="p1-ig" href="https://www.instagram.com/one.shal/" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
              @one.shal
            </a>
          </section>

          {/* P2: ABOUT */}
          <section className="panel" id="p2">
            <div className="p2-cell big">
              <div className="p2-num-accent">01</div>
              <span className="p2-tag">Who is this guy</span>
              <h2 className="p2-headline">Professionally<br />unhinged<br />content creator.</h2>
              <p className="p2-body">
                Vanshal is an internet native who turned the dark art of{' '}
                <strong>meme-making</strong> into a full-time personality disorder.
                Fluent in references nobody else gets, defender of niche humor,
                and a <strong>certified chronically online</strong> individual.
              </p>
            </div>
            <div className="p2-cell">
              <div className="p2-num-accent">02</div>
              <div className="p2-stat-num" id="c1">0+</div>
              <div className="p2-stat-lbl">Memes posted</div>
            </div>
            <div className="p2-cell">
              <div className="p2-num-accent">03</div>
              <div className="p2-stat-num" id="c2">0+</div>
              <div className="p2-stat-lbl">Sleep hours lost</div>
            </div>
            <div className="p2-cell">
              <div className="p2-num-accent">04</div>
              <div className="p2-stat-num" id="c3">0%</div>
              <div className="p2-stat-lbl">Brainrot level</div>
            </div>
          </section>

          {/* P3: MEME WALL */}
          <section className="panel" id="p3">
            <div className="p3-hdr">
              <h2 className="p3-title">Meme Wall.</h2>
              <p className="p3-src">
                From{' '}
                <a href="https://www.reddit.com/user/MasterpieceIll7317/" target="_blank" rel="noopener noreferrer">
                  u/MasterpieceIll7317
                </a>
              </p>
            </div>
            <div className="memes-grid" id="mgrid">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gridColumn:'1/-1', gridRow:'1/-1', color:'var(--muted)', fontSize:11, letterSpacing:'.12em', textTransform:'uppercase' }}>
                Loading memes&hellip;
              </div>
            </div>
          </section>

          {/* P4: VIBES */}
          <section className="panel" id="p4">
            <div className="p4-ticker-wrap">
              <div className="p4-ticker" id="ticker">
                {['Chronically Online','Meme Connoisseur','Chaotic Neutral','@one.shal','Brainrot Certified','Niche Humor Specialist',
                  'Chronically Online','Meme Connoisseur','Chaotic Neutral','@one.shal','Brainrot Certified','Niche Humor Specialist',
                ].map((item, i) => (
                  <span className="p4-ticker-item" key={i}>{item} <span>&mdash;</span></span>
                ))}
              </div>
            </div>
            <div className="p4-body">
              {[
                { n:'01', lbl:'Humor Style',    val:'Absurdist & Self-Aware',  sub:'Dangerously niche. If you get the reference, congrats — you also have a problem.' },
                { n:'02', lbl:'Platform',        val:'Instagram @one.shal',     sub:'Scroll at your own risk. Side effects include tagging your friends at 3am.' },
                { n:'03', lbl:'Superpower',      val:'4-Second Meme Recall',    sub:"Any situation. Any mood. Perfect meme, every time. It's a gift and a curse." },
                { n:'04', lbl:'Availability',    val:'Online 24/7',             sub:'Productive 0/7. But always there to send you something cursed.' },
                { n:'05', lbl:'Content Warning', val:'Existential Crisis Risk', sub:"Viewing Vanshal's content may cause sudden laughter and deep contemplation." },
                { n:'06', lbl:'Origin Story',    val:'Born on the Internet',    sub:"Before Reels, before Shorts. Been here longer than your favorite trend." },
              ].map(c => (
                <div className="p4-card" data-n={c.n} key={c.n}>
                  <div className="p4-card-accent" />
                  <div className="p4-card-lbl">{c.lbl}</div>
                  <div className="p4-card-val">{c.val}</div>
                  <div className="p4-card-sub">{c.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* P5: CONNECT */}
          <section className="panel" id="p5">
            <div className="p5-ghost">DM.</div>
            <p className="p5-eye">Panel 5 of 5 &mdash; you survived</p>
            <h2 className="p5-hl">
              <span className="p5-word"><span>Let&rsquo;s</span></span>
              <span className="p5-word"><span>make</span></span>
              <span className="p5-word acc"><span>content.</span></span>
            </h2>
            <div className="p5-links">
              <a className="p5-link" href="https://www.instagram.com/one.shal/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="p5-link-txt">Instagram</span>
              </a>
              <a className="p5-link" href="https://www.reddit.com/user/MasterpieceIll7317/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                <span className="p5-link-txt">Reddit</span>
              </a>
            </div>
            <p className="p5-foot">Vanshal &mdash; 2025</p>
          </section>

        </div>
      </div>

      <div id="dots">
        {[0,1,2,3,4].map(i => (
          <div className={`dot${i === 0 ? ' on' : ''}`} data-i={i} key={i} />
        ))}
      </div>
      <div id="plabel">Hero</div>
      <div id="hint"><b />&nbsp;Scroll</div>
    </>
  );
}
