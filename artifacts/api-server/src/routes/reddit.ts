import { Router } from "express";

const router = Router();

// ── Reddit Application-Only OAuth ─────────────────────────────────────────
// Credentials from environment variables:
//   REDDIT_CLIENT_ID     — the string under the app name on reddit.com/prefs/apps
//   REDDIT_CLIENT_SECRET — the "secret" field
//   REDDIT_USER_AGENT    — optional, defaults to "vanshal-portfolio/1.0"

const CLIENT_ID     = process.env.REDDIT_CLIENT_ID     ?? '';
const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET ?? '';
const USER_AGENT    = process.env.REDDIT_USER_AGENT    ?? 'web:vanshal-portfolio:1.0 (by /u/MasterpieceIll7317)';

interface TokenCache { token: string; expiresAt: number; }
let tokenCache: TokenCache | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const r = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!r.ok) throw new Error(`Token request failed: ${r.status}`);
  const j = await r.json() as any;
  const token: string = j.access_token;
  tokenCache = { token, expiresAt: Date.now() + (j.expires_in - 60) * 1000 };
  return token;
}

const ENDPOINTS = ['submitted', 'overview'];

router.get('/reddit/:username', async (req, res) => {
  const { username } = req.params;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    res.status(503).json({ error: 'Reddit credentials not configured (set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET)' });
    return;
  }

  try {
    const token = await getToken();

    for (const endpoint of ENDPOINTS) {
      try {
        const url = `https://oauth.reddit.com/user/${username}/${endpoint}.json?limit=100&sort=new`;
        const r = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': USER_AGENT,
          },
        });
        if (!r.ok) continue;
        const data = await r.json() as any;
        if (data?.data?.children?.length) {
          res.json(data);
          return;
        }
      } catch (_) { continue; }
    }

    res.status(404).json({ error: 'No posts found' });
  } catch (err: any) {
    res.status(502).json({ error: err?.message ?? 'Failed to fetch Reddit data' });
  }
});

export default router;
