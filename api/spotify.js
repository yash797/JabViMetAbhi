// api/spotify.js
// Vercel serverless function — CommonJS format, runs server-side

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: "Spotify credentials not configured in Vercel env vars" });
  }

  const action = req.query.action;
  const q      = req.query.q;
  const token  = req.query.token;

  /* ── get token ── */
  if (action === "token") {
    try {
      const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

      const r = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type":  "application/x-www-form-urlencoded",
          "Authorization": `Basic ${creds}`,
        },
        body: "grant_type=client_credentials",
      });

      const d = await r.json();

      if (!r.ok) {
        return res.status(r.status).json({ error: d.error_description || "Token failed" });
      }

      return res.status(200).json({
        access_token: d.access_token,
        expires_in:   d.expires_in,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── search ── */
  if (action === "search") {
    if (!q || !token) {
      return res.status(400).json({ error: "Missing q or token" });
    }
    try {
      const r = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const d = await r.json();

      if (r.status === 401) {
        return res.status(401).json({ error: "Token expired" });
      }
      if (!r.ok) {
        return res.status(r.status).json({ error: d.error?.message || "Search failed" });
      }

      return res.status(200).json(d.tracks?.items || []);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "Unknown action. Use ?action=token or ?action=search" });
};
