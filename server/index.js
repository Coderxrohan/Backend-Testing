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
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    console.log('Attempting to delete cab with ID:', id);
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if the cab exists first
    const checkResult = await client.query('SELECT * FROM cabs WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Cab not found' });
    }
    
    // Delete related schedules first
    const deletedSchedules = await client.query('DELETE FROM schedules WHERE cab_id = $1 RETURNING *', [id]);
    console.log('Deleted schedules:', deletedSchedules.rows);
    
    // Delete related routes where this cab is referenced (if any)
    const deletedRoutes = await client.query('DELETE FROM routes WHERE cab_operator_id = $1 RETURNING *', [id]);
    console.log('Deleted routes:', deletedRoutes.rows);
    
    // Delete any other related data (bookings, etc.) if they exist
    // Add more cascade deletes here as needed for other tables
    
    // Finally, delete the cab
    const result = await client.query('DELETE FROM cabs WHERE id = $1 RETURNING *', [id]);
    console.log('Deleted cab:', result.rows[0]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      deletedCab: result.rows[0],
      deletedSchedules: deletedSchedules.rows,
      deletedRoutes: deletedRoutes.rows
    });
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error deleting cab:', error);
    res.status(500).json({ error: 'Failed to delete cab: ' + error.message });
  } finally {
    client.release();
  }
});

// Add a route
app.post('/api/routes', async (req, res) => {
  try {
    console.log('Received route data:', req.body); // Debug log
    
    const { origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id } = req.body;
    
    // Validate required fields
    if (!origin || !destination || !distance_km) {
      return res.status(400).json({ error: 'Missing required fields: origin, destination, distance_km' });
    }
    
    const result = await pool.query(
      'INSERT INTO routes (origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
      [origin, destination, distance_km, eta_min, base_fare, active, cab_operator_id]
    );
    
    console.log('Route created:', result.rows[0]); // Debug log
    
    // Format the response to match what the frontend expects
    const createdRoute = result.rows[0];
    const formattedRoute = {
      id: createdRoute.id,
      from: createdRoute.origin,
      to: createdRoute.destination,
      distance: `${createdRoute.distance_km} km`
    };
    
    res.json(formattedRoute);
    
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route: ' + error.message });
  }
});

// Delete a route
app.delete('/api/routes/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    console.log('Attempting to delete route with ID:', id);
    
    // Start transaction
    await client.query('BEGIN');
    
    // Delete related schedules first
    const deletedSchedules = await client.query('DELETE FROM schedules WHERE route_id = $1 RETURNING *', [id]);
    console.log('Deleted schedules:', deletedSchedules.rows);
    
    // Delete the route
    const result = await client.query('DELETE FROM routes WHERE id = $1 RETURNING *', [id]);
    console.log('Deleted route:', result.rows[0]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.json({ 
      success: true, 
      deletedRoute: result.rows[0],
      deletedSchedules: deletedSchedules.rows
    });
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route: ' + error.message });
  } finally {
    client.release();
  }
});

// Add a schedule
app.post('/api/schedules', async (req, res) => {
  try {
    console.log('Received schedule data:', req.body); // Debug log
    
    const { cab_id, route_id, frequency, time, price } = req.body;
    
    // Validate required fields
    if (!cab_id || !route_id || !frequency || !time || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await pool.query(
      'INSERT INTO schedules (cab_id, route_id, frequency, time, price) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
      [cab_id, route_id, frequency, time, price]
    );
    
    console.log('Schedule created:', result.rows[0]); // Debug log
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule: ' + error.message });
  }
});

// Delete a schedule
app.delete('/api/schedules/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));