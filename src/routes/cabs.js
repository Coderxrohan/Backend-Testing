import express from 'express';

const router = express.Router();

// Example in-memory cab data
let cabs = [];

// Create a new cab
router.post('/', (req, res) => {
  const { name, phone, license_no, active } = req.body;

  if (!name || !phone || !license_no) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newCab = {
    id: cabs.length + 1,
    name,
    phone,
    license_no,
    active: active ?? true
  };

  cabs.push(newCab);
  res.status(201).json(newCab);
});

// Get all cabs
router.get('/', (req, res) => {
  res.json(cabs);
});

export default router;
