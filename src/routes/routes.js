import express from 'express';

const router = express.Router();

// In-memory routes array
let routes = [];

// Create a new route
router.post('/', (req, res) => {
  const { start_point, end_point, distance_km, eta_minutes } = req.body;

  if (!start_point || !end_point || !distance_km || !eta_minutes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newRoute = {
    id: routes.length + 1,
    start_point,
    end_point,
    distance_km,
    eta_minutes
  };

  routes.push(newRoute);
  res.status(201).json(newRoute);
});

// Get all routes
router.get('/', (req, res) => {
  res.json(routes);
});

export default router;
