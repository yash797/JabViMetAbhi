// api/spotify.js
// Vercel serverless function
// Fetches its own token internally — browser never handles token at all

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: "Missing Spotify credentials in Vercel env vars" });
  }

  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ error: "Missing ?q= parameter" });
  }

  try {
    // Step 1: get a fresh token server-side (no browser involvement)
    const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type":  "application/x-www-form-urlencoded",
        "Authorization": `Basic ${creds}`,
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(tokenRes.status).json({ error: tokenData.error_description || "Token failed" });
    }
    const accessToken = tokenData.access_token;

    // Step 2: search with that token
    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const searchData = await searchRes.json();
    if (!searchRes.ok) {
      return res.status(searchRes.status).json({ error: searchData.error?.message || "Search failed" });
    }

    return res.status(200).json(searchData.tracks?.items || []);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
