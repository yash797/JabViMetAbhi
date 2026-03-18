// api/spotify.js — Vercel serverless function

const https = require("https");

function httpsPost(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(body);
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": data.length } },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function httpsGet(hostname, path, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path, method: "GET", headers },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET" });
  }

  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing ?q= parameter" });

  try {
    /* Step 1 — get token */
    const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const tokenResp = await httpsPost(
      "accounts.spotify.com",
      "/api/token",
      {
        "Content-Type":  "application/x-www-form-urlencoded",
        "Authorization": `Basic ${creds}`,
      },
      "grant_type=client_credentials"
    );

    const tokenData = JSON.parse(tokenResp.body);
    console.log("Token status:", tokenResp.status);

    if (tokenResp.status !== 200) {
      return res.status(200).json({ 
        error: tokenData.error_description || tokenData.error || "Token failed",
        debug: "token_step_failed",
        spotify_status: tokenResp.status
      });
    }

    const accessToken = tokenData.access_token;

    /* Step 2 — search */
    const searchPath = `/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6`;
    console.log("Searching:", searchPath);

    const searchResp = await httpsGet(
      "api.spotify.com",
      searchPath,
      { Authorization: `Bearer ${accessToken}` }
    );

    console.log("Search status:", searchResp.status);
    console.log("Search body preview:", searchResp.body.slice(0, 200));

    const searchData = JSON.parse(searchResp.body);

    if (searchResp.status !== 200) {
      // Return 200 always so browser gets JSON not Vercel error page
      return res.status(200).json({
        error: searchData.error?.message || "Search failed",
        debug: "search_step_failed",
        spotify_status: searchResp.status,
        spotify_error: searchData.error
      });
    }

    return res.status(200).json(searchData.tracks?.items || []);

  } catch (e) {
    console.log("Exception:", e.message);
    return res.status(200).json({ error: e.message, debug: "exception" });
  }
};
