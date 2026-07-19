const fetch = require('node-fetch'); // Depending on Node version, might need global fetch

const JSON_BLOB_API = "https://jsonblob.com/api/jsonBlob/019f7740-deb2-7f7a-9821-056edd3c9447";

export default async function handler(req, res) {
  // Use native fetch if available (Node 18+)
  const _fetch = typeof fetch !== 'undefined' ? fetch : require('node-fetch');

  if (req.method === 'GET') {
    const telegramId = req.query.telegramId;
    try {
      const response = await _fetch(JSON_BLOB_API, { cache: 'no-store' });
      const data = await response.json();
      if (telegramId) {
        const lead = data.find(l => String(l["Telegram ID"]) === String(telegramId));
        if (!lead) {
          return res.status(404).json({ error: "Not found" });
        }
        return res.status(200).json(lead);
      }
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch" });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const response = await _fetch(JSON_BLOB_API, { cache: 'no-store' });
      const data = await response.json();
      
      body._id = Math.random().toString(36).substr(2, 9);
      data.push(body);

      await _fetch(JSON_BLOB_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });
      return res.status(200).json(body);
    } catch (e) {
      return res.status(500).json({ error: "Failed to create" });
    }
  }

  if (req.method === 'PUT') {
    const telegramId = req.query.telegramId;
    if (!telegramId) {
      return res.status(400).json({ error: "Missing telegramId" });
    }

    try {
      const updates = req.body;
      const response = await _fetch(JSON_BLOB_API, { cache: 'no-store' });
      let list = await response.json();
      
      const index = list.findIndex(l => String(l["Telegram ID"]) === String(telegramId));
      if (index === -1) {
        return res.status(404).json({ error: "Not found" });
      }

      list[index] = { ...list[index], ...updates };

      await _fetch(JSON_BLOB_API, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(list)
      });
      return res.status(200).json({ success: true, updated: list[index] });
    } catch (e) {
      return res.status(500).json({ error: "Failed to update" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
