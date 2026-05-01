// api/spotify.js — Vercel serverless function

const https = require("https");

/* ───────────────────────── HELPERS ───────────────────────── */

function httpsGet(hostname, path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "GET", headers },
      (r) => {
        let b = "";
        r.on("data", (c) => (b += c));
        r.on("end", () => resolve({ status: r.statusCode, body: b }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const d = Buffer.from(body);
    const req = https.request(
      {
        hostname,
        path,
        method: "POST",
        headers: { ...headers, "Content-Length": d.length },
      },
      (r) => {
        let b = "";
        r.on("data", (c) => (b += c));
        r.on("end", () => resolve({ status: r.statusCode, body: b }));
      }
    );
    req.on("error", reject);
    req.write(d);
    req.end();
  });
}

/* ───────────────────────── REDIS ───────────────────────── */

const UPSTASH_URL   = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const u = new URL(`/get/${key}`, UPSTASH_URL);

  const r = await httpsGet(u.hostname, u.pathname, {
    Authorization: `Bearer ${UPSTASH_TOKEN}`,
  });

  const d = JSON.parse(r.body);
  return d.result ? JSON.parse(d.result) : [];
}

async function redisSet(key, value) {
  const u = new URL(`/set/${key}`, UPSTASH_URL);

  const body = JSON.stringify(JSON.stringify(value));

  await httpsPost(
    u.hostname,
    u.pathname,
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
    body
  );
}

/* ───────────────────────── CONFIG ───────────────────────── */

const PLAYLIST_KEY = "va_wedding_songs";

/* ───────────────────────── HANDLER ───────────────────────── */

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  const action = req.query.action;

  /* ── SEARCH (Deezer) ── */
  if (!action && req.query.q) {
    try {
      const r = await httpsGet(
        "api.deezer.com",
        `/search?q=${encodeURIComponent(req.query.q)}&limit=6`
      );

      const data = JSON.parse(r.body);

      const tracks = (data.data || []).map((t) => ({
        id: String(t.id),
        name: t.title,
        artist: t.artist?.name || "",
        album: t.album?.title || "",
        image: t.album?.cover_medium || "",
        duration_ms: (t.duration || 0) * 1000,
        url: t.link || "#",
      }));

      return res.status(200).json(tracks);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── GET PLAYLIST ── */
  if (action === "playlist" && req.method === "GET") {
    try {
      const songs = await redisGet(PLAYLIST_KEY);
      return res.status(200).json(Array.isArray(songs) ? songs : []);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  /* ── SUBMIT SONGS ── */
  if (action === "submit" && req.method === "POST") {
    try {
      let body = "";

      await new Promise((resolve) => {
        req.on("data", (c) => (body += c));
        req.on("end", resolve);
      });

      const { songs: newSongs } = JSON.parse(body);

      const existing = await redisGet(PLAYLIST_KEY);
      const existingIds = new Set((existing || []).map((s) => s.id));

      const toAdd = (newSongs || []).filter((s) => !existingIds.has(s.id));
      const duplicates = (newSongs || []).filter((s) =>
        existingIds.has(s.id)
      );

      const updated = [...(existing || []), ...toAdd];

      await redisSet(PLAYLIST_KEY, updated);

      return res.status(200).json({
        success: true,
        added: toAdd.length,
        duplicates: duplicates.length,
        total: updated.length,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
};