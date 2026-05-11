import { Router } from "express";

const router = Router();

router.get("/memes", async (_req, res) => {
  try {
    const response = await fetch("https://meme-api.com/gimme/memes/20", {
      headers: { "User-Agent": "VanshalPortfolio/1.0" },
    });

    if (!response.ok) {
      res.status(502).json({ error: "Meme API unavailable" });
      return;
    }

    const data = (await response.json()) as {
      memes: Array<{
        url: string;
        title: string;
        postLink: string;
        nsfw: boolean;
        preview: string[];
      }>;
    };

    const posts = data.memes
      .filter(
        (m) =>
          !m.nsfw &&
          m.url &&
          /\.(jpg|jpeg|png|webp)(\?|$)/i.test(m.url),
      )
      .slice(0, 8)
      .map((m) => ({
        url: m.url,
        title: m.title,
        permalink: m.postLink,
      }));

    res.json({ posts });
  } catch {
    res.status(502).json({ error: "Failed to fetch memes" });
  }
});

export default router;
