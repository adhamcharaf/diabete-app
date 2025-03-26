import express from 'express';
import { updateAgentInfo } from '../controllers/agent.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route pour compléter les infos de l'agent après inscription
router.post('/infos', verifyToken, updateAgentInfo);

export default router;
