import { Router } from "express";

const router = Router();

// ── Reddit RSS Feed (completely free, no credentials) ─────────────────────
// Reddit's Atom RSS feed works without OAuth from any server.
// We parse the XML with regex (no extra deps) and return the same
// shape as the Reddit JSON API so the frontend needs no changes.

const USER_AGENT = 'Mozilla/5.0 vanshal-portfolio/1.0';

const cache = new Map<string, { data: unknown; fetchedAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function parseRss(xml: string): Array<{ url: string; title: string; permalink: string }> {
  const posts: Array<{ url: string; title: string; permalink: string }> = [];

  // Split into <entry> blocks
  const entries = xml.split('<entry>').slice(1);

  for (const entry of entries) {
    // Image: prefer <media:thumbnail url="..."> (always a direct image URL)
    const thumbMatch = entry.match(/<media:thumbnail url="([^"]+)"/);
    // Fallback: img src inside the HTML-encoded content
    const imgMatch = entry.match(/img src=&quot;([^&]+)&quot;/);
    const imgUrl = thumbMatch?.[1] ?? imgMatch?.[1] ?? '';

    // Title (last <title> in the entry since feed also has one at top)
    const titleMatch = entry.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch?.[1]?.trim() ?? '';

    // Permalink: <link href="...">
    const linkMatch = entry.match(/<link href="([^"]+)"/);
    const permalink = linkMatch?.[1] ?? '';

    if (imgUrl && title) {
      posts.push({ url: imgUrl, title, permalink });
    }
  }

  return posts;
}

router.get('/reddit/:username', async (req, res) => {
  const { username } = req.params;

  // Serve from cache if fresh
  const cached = cache.get(username);
  if (cached && Date.now() - (cached.fetchedAt as number) < CACHE_TTL) {
    res.json(cached.data);
    return;
  }

  try {
    const url = `https://www.reddit.com/user/${encodeURIComponent(username)}/submitted.rss`;
    const r = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });

    if (!r.ok) {
      res.status(r.status).json({ error: `RSS fetch failed: ${r.status}` });
      return;
    }

    const xml = await r.text();
    const posts = parseRss(xml);

    if (!posts.length) {
      res.status(404).json({ error: 'No image posts found for this user' });
      return;
    }

    // Return in the same shape as Reddit JSON API so the frontend is unchanged
    const data = {
      data: {
        children: posts.map(p => ({
          data: {
            url: p.url,
            url_overridden_by_dest: p.url,
            title: p.title,
            permalink: p.permalink,
          },
        })),
      },
    };

    cache.set(username, { data, fetchedAt: Date.now() });
    res.json(data);
  } catch (err: any) {
    res.status(502).json({ error: err?.message ?? 'Failed to fetch Reddit RSS' });
  }
});

export default router;
