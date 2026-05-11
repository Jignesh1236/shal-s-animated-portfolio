import { Router } from "express";

const router = Router();

router.get("/memes", async (_req, res) => {
  try {
    // Reddit API fallback logic
    const subreddits = ["memes", "dankmemes", "wholesomememes"];
    const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];
    
    const response = await fetch(`https://www.reddit.com/r/${randomSub}/top.json?limit=25`, {
      headers: { "User-Agent": "VanshalPortfolio/1.0" },
    });

    if (!response.ok) {
      res.status(502).json({ error: "Reddit API unavailable" });
      return;
    }

    const data = await response.json();
    const children = data.data.children;

    const posts = children
      .map((child: any) => child.data)
      .filter(
        (m: any) =>
          !m.over_18 &&
          m.url &&
          /\.(jpg|jpeg|png|webp)(\?|$)/i.test(m.url),
      )
      .slice(0, 10)
      .map((m: any) => ({
        url: m.url,
        title: m.title,
        permalink: `https://reddit.com${m.permalink}`,
      }));

    res.json({ posts });
  } catch (error) {
    res.status(502).json({ error: "Failed to fetch memes from Reddit" });
  }
});

export default router;
