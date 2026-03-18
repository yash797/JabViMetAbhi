// api/spotify.js
// Handles: song search (iTunes) + save/load playlist (Upstash Redis)

const https = require("https");

/* ── HTTPS helpers ── */
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

/* ── Upstash Redis helpers ── */
async function redisGet(key) {
  const url  = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const u    = new URL(`/get/${key}`, url);
  const resp = await httpsGet(u.hostname, u.pathname + u.search, {
    Authorization: `Bearer ${token}`,
  });
  const data = JSON.parse(resp.body);
  return data.result ? JSON.parse(data.result) : null;
}

async function redisSet(key, value) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  const u     = new URL(`/set/${key}`, url);
  const body  = JSON.stringify(JSON.stringify(value));
  await httpsPost(u.hostname, u.pathname, {
    "Content-Type":  "application/json",
    "Authorization": `Bearer ${token}`,
  }, body);
  return true;
}

const PLAYLIST_KEY = "va_wedding_playlist";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  /* ── GET playlist ── */
  if (req.method === "GET" && action === "playlist") {
    try {
      const songs = await redisGet(PLAYLIST_KEY) || [];
      return res.status(200).json(songs);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── ADD song to playlist ── */
  if (req.method === "POST" && action === "add") {
    try {
      let body = "";
      await new Promise((resolve) => {
        req.on("data", c => body += c);
        req.on("end", resolve);
      });
      const song  = JSON.parse(body);
      const songs = await redisGet(PLAYLIST_KEY) || [];

      // avoid duplicates
      if (!songs.find(s => s.id === song.id)) {
        songs.unshift(song);
        await redisSet(PLAYLIST_KEY, songs);
      }
      return res.status(200).json(songs);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── REMOVE song from playlist ── */
  if (req.method === "DELETE" && action === "remove") {
    try {
      const id    = req.query.id;
      const songs = await redisGet(PLAYLIST_KEY) || [];
      const updated = songs.filter(s => s.id !== id);
      await redisSet(PLAYLIST_KEY, updated);
      return res.status(200).json(updated);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── SEARCH songs (iTunes) ── */
  if (req.method === "GET" && req.query.q) {
    try {
      const q    = req.query.q;
      const resp = await httpsGet(
        "itunes.apple.com",
        `/search?term=${encodeURIComponent(q)}&media=music&limit=6&country=IN`
      );
      const data = JSON.parse(resp.body);
      const tracks = (data.results || []).map(t => ({
        id:           String(t.trackId),
        name:         t.trackName,
        artists:      [{ name: t.artistName }],
        album:        { name: t.collectionName, images: [{ url: t.artworkUrl100 }] },
        duration_ms:  t.trackTimeMillis,
        external_urls:{ spotify: t.trackViewUrl },
        preview_url:  t.previewUrl || null,
      }));
      return res.status(200).json(tracks);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
};
