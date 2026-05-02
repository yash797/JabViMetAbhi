const https = require("https");

/* ───────────── HTTPS HELPERS ───────────── */

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
        headers: {
          ...headers,
          "Content-Length": d.length,
        },
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

/* ───────────── ENV ───────────── */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_URL || !UPSTASH_TOKEN) {
  console.error("❌ Missing Upstash env variables");
}

/* ───────────── REDIS ───────────── */

async function redisGet(key) {
  const u = new URL(`/get/${key}`, UPSTASH_URL);

  const r = await httpsGet(u.hostname, u.pathname, {
    Authorization: `Bearer ${UPSTASH_TOKEN}`,
  });

  const parsed = JSON.parse(r.body);

  if (parsed.error) {
    throw new Error(parsed.error);
  }

  let data = parsed.result;

  if (!data) return [];

  // 🔥 KEY FIX — always try parsing string
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.warn("⚠️ Failed to parse string:", data);
      return [];
    }
  }

  // Final safety
  if (!Array.isArray(data)) {
    console.warn("⚠️ Unexpected Redis format:", data);
    return [];
  }

  return data;
}

async function redisSet(key, value) {
  const u = new URL(`/set/${key}`, UPSTASH_URL);

  const body = JSON.stringify(JSON.stringify(value));

  const r = await httpsPost(
    u.hostname,
    u.pathname,
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
    },
    body
  );

  console.log("🟡 Redis SET response:", r.body);

  const parsed = JSON.parse(r.body);

  if (parsed.error) {
    throw new Error(parsed.error);
  }
}

/* ───────────── CONFIG ───────────── */

const PLAYLIST_KEY = "va_wedding_songs";

/* ───────────── HANDLER ───────────── */

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const action = req.query.action;

  /* ───── SEARCH ───── */
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
      console.error("Search error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  /* ───── GET PLAYLIST ───── */
  if (action === "playlist" && req.method === "GET") {
    try {
      const songs = await redisGet(PLAYLIST_KEY);
      return res.status(200).json(songs);
    } catch (e) {
      console.error("GET playlist error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  /* ───── SUBMIT ───── */
  if (action === "submit" && req.method === "POST") {
    try {
      let body = "";

      await new Promise((resolve) => {
        req.on("data", (c) => (body += c));
        req.on("end", resolve);
      });

      let parsed;

      try {
        parsed = body ? JSON.parse(body) : {};
      } catch (e) {
        console.error("❌ JSON parse error:", e);
        return res.status(400).json({ error: "Invalid JSON body" });
      }

      const newSongs = parsed.songs || [];

      console.log("🟢 Incoming songs:", newSongs);

      const existing = await redisGet(PLAYLIST_KEY);

      const existingIds = new Set((existing || []).map((s) => s.id));

      const toAdd = newSongs.filter((s) => !existingIds.has(s.id));
      const duplicates = newSongs.filter((s) =>
        existingIds.has(s.id)
      );

      const updated = [...(existing || []), ...toAdd];

      console.log("🟡 Saving songs:", updated);

      await redisSet(PLAYLIST_KEY, updated);

      const verify = await redisGet(PLAYLIST_KEY);
      console.log("✅ After save:", verify);

      return res.status(200).json({
        success: true,
        added: toAdd.length,
        duplicates: duplicates.length,
        total: updated.length,
      });
    } catch (e) {
      console.error("🔥 SUBMIT ERROR:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(400).json({ error: "Unknown action" });
};