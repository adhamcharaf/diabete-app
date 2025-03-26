import express from 'express';
import {
    getMedecinsAValider,
    validerMedecin,
    rejeterMedecin,
    createAdmin,
    activerUtilisateur,
    desactiverUtilisateur
} from '../controllers/admin.controller.js';

import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Récupérer les médecins non validés
router.get('/medecins-a-valider', verifyToken, checkRole('admin'), getMedecinsAValider);

// Valider un médecin
router.put('/valider-medecin/:id', verifyToken, checkRole('admin'), validerMedecin);

// Rejeter un médecin
router.delete('/rejeter-medecin/:id', verifyToken, checkRole('admin'), rejeterMedecin);

// Créer un autre admin
router.post('/create-admin', verifyToken, checkRole('admin'), createAdmin);

//activer et desactiver un compte
router.put('/desactiver-user/:id', verifyToken, checkRole('admin'), desactiverUtilisateur);
router.put('/activer-user/:id', verifyToken, checkRole('admin'), activerUtilisateur);

export default router;
