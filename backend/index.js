import express from 'express';
import dotenv from 'dotenv';
import testRoutes from './routes/test.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.use('/api', testRoutes); // Test + protected route
app.use('/api/auth', authRoutes); // Authentification

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
