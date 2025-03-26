import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import testRoutes from './routes/test.route.js';
import authRoutes from './routes/auth.route.js';
import medecinRoutes from './routes/medecin.route.js';
import agentRoutes from './routes/agent.route.js';
import adminRoutes from './routes/admin.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', testRoutes); // Test + protected route
app.use('/api/auth', authRoutes); // Authentification
app.use('/api/medecin', medecinRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
