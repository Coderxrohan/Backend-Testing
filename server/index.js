const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cab_booking',
  password: 'kamlesh@2004',
  port: 5432,
});

// Get all cab operators
app.get('/api/cab-operators', async (req, res) => {
  const result = await pool.query('SELECT * FROM cab_operators WHERE active = TRUE');
  res.json(result.rows);
});

// Updated Get all routes
app.get('/api/routes', async (req, res) => {
  const result = await pool.query("SELECT id, origin AS from, destination AS to, CONCAT(distance_km, ' km') AS distance FROM routes WHERE active = TRUE");
  res.json(result.rows);
});

// Get reports
app.get('/api/reports', async (req, res) => {
  const result = await pool.query('SELECT * FROM reports');
  res.json(result.rows);
});

// Get top revenue
app.get('/api/revenue', async (req, res) => {
  const result = await pool.query('SELECT * FROM revenue ORDER BY total_revenue DESC LIMIT 5');
  res.json(result.rows);
});

// Get all vendors
app.get('/api/vendors', async (req, res) => {
  const result = await pool.query('SELECT * FROM vendors');
  res.json(result.rows);
});

// Get all customers
app.get('/api/customers', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers');
  res.json(result.rows);
});

// Get all cabs
app.get('/api/cabs', async (req, res) => {
  const result = await pool.query('SELECT * FROM cabs');
  res.json(result.rows);
});

// Updated Get all schedules
app.get('/api/schedules', async (req, res) => {
  const result = await pool.query("SELECT s.id, c.name AS cab, CONCAT(r.origin, ' - ', r.destination) AS route, s.frequency, s.time, s.price FROM schedules s JOIN cabs c ON s.cab_id = c.id JOIN routes r ON s.route_id = r.id");
  res.json(result.rows);
});

// Add a cab
app.post('/api/cabs', async (req, res) => {
  const { name, type, seats } = req.body;
  const result = await pool.query('INSERT INTO cabs (name, type, seats) VALUES ($1, $2, $3) RETURNING *', [name, type, seats]);
  res.json(result.rows[0]);
});

// Delete a cab
app.delete('/api/cabs/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM cabs WHERE id = $1', [id]);
  res.json({ success: true });
});

// Add a route
app.post('/api/routes', async (req, res) => {
  const { origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id } = req.body;
  const result = await pool.query('INSERT INTO routes (origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id]);
  res.json(result.rows[0]);
});

// Delete a route
app.delete('/api/routes/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM routes WHERE id = $1', [id]);
  res.json({ success: true });
});

// Add a schedule
app.post('/api/schedules', async (req, res) => {
  const { cab_id, route_id, frequency, time, price } = req.body;
  const result = await pool.query('INSERT INTO schedules (cab_id, route_id, frequency, time, price) VALUES ($1, $2, $3, $4, $5) RETURNING *', [cab_id, route_id, frequency, time, price]);
  res.json(result.rows[0]);
});

// Delete a schedule
app.delete('/api/schedules/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));