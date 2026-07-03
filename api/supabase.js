module.exports = async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Faltan variables de entorno SUPABASE_URL y SUPABASE_KEY' });
  }

  const path = req.query.path || '';
  const url = SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/' + path.replace(/^\//, '');

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (req.method === 'POST') {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body)
      });
      if (!response.ok) return res.status(response.status).json({ error: response.statusText });
      const data = response.headers.get('content-type')?.includes('json') ? await response.json() : null;
      return res.status(201).json(data);
    } else {
      const response = await fetch(url, { headers });
      if (!response.ok) return res.status(response.status).json({ error: response.statusText });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
