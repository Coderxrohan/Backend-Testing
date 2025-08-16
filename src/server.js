import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import cabRoutes from './routes/cabs.js';  // update path if needed
import routeRoutes from './routes/routes.js';
import scheduleRoutes from './routes/schedules.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register routes
app.use('/api/cabs', cabRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/schedules', scheduleRoutes);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚖 Server running on http://localhost:${PORT}`);
});
