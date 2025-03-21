import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route protégée
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: `Bienvenue, utilisateur ID ${req.user.id} avec rôle ${req.user.role}!`,
    user: req.user,
  });
});

export default router;
