import express from 'express';

const router = express.Router();

// In-memory schedules array
let schedules = [];

// Create a new schedule
router.post('/', (req, res) => {
  const { operator_id, route_id, departure_time, arrival_time, status } = req.body;

  if (!operator_id || !route_id || !departure_time || !arrival_time || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newSchedule = {
    id: schedules.length + 1,
    operator_id,
    route_id,
    departure_time,
    arrival_time,
    status
  };

  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

// Get all schedules
router.get('/', (req, res) => {
  res.json(schedules);
});

export default router;
