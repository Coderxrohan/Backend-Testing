// server/index.js  (FINAL version) - replace your current file with this exact content
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// DB config - set env vars if you prefer
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'cab_booking',
  password: process.env.PGPASSWORD || '', // <-- update if different
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
});

function logAndSendError(res, err) {
  console.error('SERVER ERROR:', err && err.stack ? err.stack : err);
  // Always return JSON (so front-end res.json() will not fail)
  res.status(500).json({ error: String(err && err.message ? err.message : err) });
}

/* ----------------- Utility helpers ----------------- */

// Parse a "time" input which may be "HH:mm" or an ISO string.
// Returns "HH:mm" string suitable for Postgres TIME.
function normalizeTimeForDb(input) {
  if (!input) return null;
  // If already HH:mm
  if (/^\d{1,2}:\d{2}$/.test(input)) {
    const [h, m] = input.split(':').map(Number);
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  // Try parsing as ISO / Date
  const d = new Date(input);
  if (!isNaN(d.getTime())) {
    // Use local time hours/minutes
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  // fallback null
  return null;
}

// If the DB schema requires eta_min / base_fare not-null, provide sensible defaults
function defaultEtaAndFare(distanceKm) {
  // crude ETA: 2 min per km (round up), min 10
  const eta = Math.max(10, Math.ceil((Number(distanceKm) || 0) * 2));
  // crude base fare: 1.5 per km, min 10
  const fare = Math.max(10, (Number(distanceKm) || 0) * 1.5);
  // round fare to 2 decimals
  return { eta_min: eta, base_fare: Math.round(fare * 100) / 100 };
}

/* ----------------- Cab operators ----------------- */

app.get('/api/cab-operators', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM cab_operators WHERE active = TRUE ORDER BY id');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

/* ----------------- Routes ----------------- */
// Frontend expects GET /api/routes -> array of { id, from, to, distance }
// Frontend POST sends { from, to, distance } (per the UI fields)
app.get('/api/routes', async (_req, res) => {
  try {
    // Return distance as "xx.xx km" string to match UI formatting
    const q = `SELECT id, origin AS "from", destination AS "to", CONCAT(TRIM(TRAILING '.0' FROM TRIM(TO_CHAR(distance_km,'FM99999.99'))),' km') AS distance
               FROM routes WHERE active = TRUE ORDER BY id`;
    const r = await pool.query(q);
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

app.post('/api/routes', async (req, res) => {
  try {
    const { from, to, distance } = req.body || {};

    if (!from || !to || (distance == null || distance === '')) {
      return res.status(400).json({ error: 'from, to and distance are required' });
    }

    // Accept distance either "12.5" or "12.5 km" and coerce to number
    const distanceStr = String(distance).replace(/[^0-9.]/g, '');
    const distanceKm = Number(distanceStr);
    if (Number.isNaN(distanceKm)) return res.status(400).json({ error: 'invalid distance' });

    // Provide defaults for eta_min and base_fare if schema requires not-null
    const { eta_min, base_fare } = defaultEtaAndFare(distanceKm);

    const q = `INSERT INTO routes (origin, destination, distance_km, eta_min, base_fare, active)
               VALUES ($1,$2,$3,$4,$5, TRUE)
               RETURNING id, origin AS "from", destination AS "to", CONCAT(TO_CHAR(distance_km,'FM99999.99'), ' km') AS distance`;
    const vals = [from, to, distanceKm, eta_min, base_fare];
    const r = await pool.query(q, vals);
    // return the created object (frontend expects object)
    res.json(r.rows[0]);
  } catch (err) { logAndSendError(res, err); }
});

app.delete('/api/routes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    await pool.query('DELETE FROM routes WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { logAndSendError(res, err); }
});

/* ----------------- Cabs ----------------- */

app.get('/api/cabs', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM cabs ORDER BY id');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

app.post('/api/cabs', async (req, res) => {
  try {
    const { name, type, seats } = req.body || {};
    if (!name || !type || !seats) return res.status(400).json({ error: 'name,type,seats required' });
    const r = await pool.query('INSERT INTO cabs (name, type, seats) VALUES ($1,$2,$3) RETURNING *', [name, type, Number(seats)]);
    res.json(r.rows[0]);
  } catch (err) { logAndSendError(res, err); }
});

app.delete('/api/cabs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    await pool.query('DELETE FROM cabs WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { logAndSendError(res, err); }
});

/* ----------------- Schedules ----------------- */
// GET returns rows shaped: { id, cab, route, frequency, time, price }
app.get('/api/schedules', async (_req, res) => {
  try {
    const q = `SELECT s.id, c.name AS cab, CONCAT(r.origin,' - ', r.destination) AS route,
                      s.frequency, TO_CHAR(s.time,'HH24:MI') AS time, s.price
               FROM schedules s
               JOIN cabs c ON s.cab_id = c.id
               JOIN routes r ON s.route_id = r.id
               ORDER BY s.id`;
    const r = await pool.query(q);
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

// POST expects frontend sends: { cab: <name>, route: "<origin> - <destination>", frequency, time, price }
// Accepts time as "HH:mm" or an ISO timestamp and converts to "HH:mm" for DB.
app.post('/api/schedules', async (req, res) => {
  try {
    const { cab, route, frequency, time, price } = req.body || {};
    if (!cab || !route || !frequency || !time || price == null) {
      return res.status(400).json({ error: 'cab, route, frequency, time and price required' });
    }

    // Look up cab_id by name (frontend uses cab name)
    const cabRes = await pool.query('SELECT id FROM cabs WHERE name=$1 LIMIT 1', [cab]);
    if (!cabRes.rows[0]) return res.status(400).json({ error: `Cab not found: ${cab}` });
    const cabId = cabRes.rows[0].id;

    // Look up route_id by splitting route string or by matching origin/destination
    // route value format is usually "Origin - Destination"
    let routeId = null;
    // Try parsing "Origin - Destination"
    const parts = String(route).split(' - ').map(p => p.trim());
    if (parts.length === 2) {
      const [originPart, destPart] = parts;
      const rRes = await pool.query('SELECT id FROM routes WHERE origin = $1 AND destination = $2 LIMIT 1', [originPart, destPart]);
      if (rRes.rows[0]) routeId = rRes.rows[0].id;
    }
    // If still not found, try searching by concatenation fallback
    if (!routeId) {
      const rRes2 = await pool.query("SELECT id FROM routes WHERE (origin || ' - ' || destination) = $1 LIMIT 1", [route]);
      if (rRes2.rows[0]) routeId = rRes2.rows[0].id;
    }
    if (!routeId) return res.status(400).json({ error: `Route not found: ${route}` });

    // Normalize time input
    const normalizedTime = normalizeTimeForDb(String(time));
    if (!normalizedTime) return res.status(400).json({ error: 'invalid time format' });

    // Insert schedule
    const insertQ = `INSERT INTO schedules (cab_id, route_id, frequency, time, price)
                     VALUES ($1,$2,$3,$4,$5) RETURNING id`;
    const insertVals = [cabId, routeId, frequency, normalizedTime, Number(price)];
    const ins = await pool.query(insertQ, insertVals);

    // Respond with object shaped like frontend expects
    res.json({
      id: ins.rows[0].id,
      cab,
      route,
      frequency,
      time: normalizedTime,
      price: Number(price)
    });
  } catch (err) { logAndSendError(res, err); }
});

app.delete('/api/schedules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    await pool.query('DELETE FROM schedules WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) { logAndSendError(res, err); }
});

/* ----------------- Reports / Revenue / Vendors / Customers ----------------- */

app.get('/api/reports', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM reports ORDER BY date DESC LIMIT 100');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

app.get('/api/revenue', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM revenue ORDER BY total_revenue DESC LIMIT 10');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

app.get('/api/vendors', async (_req, res) => {
  try {
    const r = await pool.query('SELECT id, name, contact, address, kyc_status AS "kycStatus" FROM vendors ORDER BY id');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

app.get('/api/customers', async (_req, res) => {
  try {
    const r = await pool.query('SELECT * FROM customers ORDER BY id');
    res.json(r.rows);
  } catch (err) { logAndSendError(res, err); }
});

/* ----------------- Start server ----------------- */
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
