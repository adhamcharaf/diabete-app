import express from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route d’inscription
router.post('/register', register);

// Route de connexion
router.post('/login', login);

// Route pour récupérer les infos de l'utilisateur connecté
router.get('/me', verifyToken, me);

export default router;
