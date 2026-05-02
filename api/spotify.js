// api/spotify.js — Vercel serverless function
// Handles: Deezer search + Upstash Redis playlist CRUD
// No CORS issues — runs server-side

const https = require("https");

function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "GET", headers },
      (r) => { let b = ""; r.on("data", c => b += c); r.on("end", () => resolve({ status: r.statusCode, body: b })); }
    );
    req.on("error", reject);
    req.end();
  });
}

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const d = Buffer.from(body);
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": d.length } },
      (r) => { let b = ""; r.on("data", c => b += c); r.on("end", () => resolve({ status: r.statusCode, body: b })); }
    );
    req.on("error", reject);
    req.write(d);
    req.end();
  });
}

/* ── Upstash helpers ── */
async function redisGet(key) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const u     = new URL(`/get/${key}`, url);
  const r     = await httpsGet(u.hostname, u.pathname, { Authorization: `Bearer ${token}` });
  const d     = JSON.parse(r.body);
  return d.result ? JSON.parse(d.result) : [];
}

async function redisSet(key, value) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const u     = new URL(`/set/${key}`, url);
  const body  = JSON.stringify(JSON.stringify(value));
  await httpsPost(u.hostname, u.pathname, {
    "Content-Type":  "application/json",
    "Authorization": `Bearer ${token}`,
  }, body);
}

const PLAYLIST_KEY = "va_wedding_songs";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  /* ── SEARCH via Deezer ── */
  if (!action && req.query.q) {
    try {
      const q = req.query.q;
      const r = await httpsGet(
        "api.deezer.com",
        `/search?q=${encodeURIComponent(q)}&limit=6`
      );
      const data = JSON.parse(r.body);
      const tracks = (data.data || []).map(t => ({
        id:          String(t.id),
        name:        t.title,
        artist:      t.artist?.name || "",
        album:       t.album?.title || "",
        image:       t.album?.cover_medium || "",
        duration_ms: (t.duration || 0) * 1000,
        url:         t.link || "#",
      }));
      return res.status(200).json(tracks);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── GET playlist ── */
  if (action === "playlist" && req.method === "GET") {
    try {
      const songs = await redisGet(PLAYLIST_KEY);
      return res.status(200).json(Array.isArray(songs) ? songs : []);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── SUBMIT songs (batch add) ── */
  if (action === "submit" && req.method === "POST") {
    try {
      let body = "";
      await new Promise(resolve => { req.on("data", c => body += c); req.on("end", resolve); });
      const { songs: newSongs } = JSON.parse(body);

      const existing    = await redisGet(PLAYLIST_KEY);
      const existingIds = new Set((existing || []).map(s => s.id));

      const toAdd      = (newSongs || []).filter(s => !existingIds.has(s.id));
      const duplicates = (newSongs || []).filter(s =>  existingIds.has(s.id));

      const updated = [...(existing || []), ...toAdd];
      await redisSet(PLAYLIST_KEY, updated);

      return res.status(200).json({
        success:    true,
        added:      toAdd.length,
        duplicates: duplicates.length,
        total:      updated.length,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
};