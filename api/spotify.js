// api/songs.js — iTunes Search API proxy
// Free, no auth, no Spotify account needed

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing ?q=" });

  try {
    const https = require("https");

    const result = await new Promise((resolve, reject) => {
      const path = `/search?term=${encodeURIComponent(q)}&media=music&limit=6&country=IN`;
      const req2 = https.request(
        { hostname: "itunes.apple.com", path, method: "GET" },
        (r) => {
          let raw = "";
          r.on("data", (c) => (raw += c));
          r.on("end", () => resolve({ status: r.statusCode, body: raw }));
        }
      );
      req2.on("error", reject);
      req2.end();
    });

    const data = JSON.parse(result.body);

    // Normalize to same shape Playlist.jsx expects
    const tracks = (data.results || []).map((t) => ({
      id:       String(t.trackId),
      name:     t.trackName,
      artists:  [{ name: t.artistName }],
      album:    { name: t.collectionName, images: [{ url: t.artworkUrl100 }] },
      duration_ms: t.trackTimeMillis,
      external_urls: { spotify: t.trackViewUrl },
      preview_url: t.previewUrl || null,
    }));

    return res.status(200).json(tracks);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
