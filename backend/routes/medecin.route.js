import express from 'express';
import { updateMedecinInfo } from '../controllers/medecin.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route pour compléter les infos du médecin après inscription
router.post('/infos', verifyToken, updateMedecinInfo);

export default router;
