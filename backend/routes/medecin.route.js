import express from 'express';
import {
    updateMedecinInfo,
    demanderPriseEnCharge,
    getDemandesRecues,
    getMesPatients,
    ajouterSuivi,
    getSuivisPatient,
    accepterDemande,
    refuserDemande,
    modifierSuivi,
    supprimerSuivi
} from '../controllers/medecin.controller.js';
import {verifyToken} from '../middlewares/auth.middleware.js';
import {checkRole} from '../middlewares/role.middleware.js';


const router = express.Router();

// Route pour compléter les infos du médecin après inscription
router.post('/infos', verifyToken, updateMedecinInfo);

// Route pour demande de prise en charge (initiée par le médecin)
router.post('/demande-prise-en-charge', verifyToken, checkRole('medecin'), demanderPriseEnCharge);

// Route pour accepter une prise en charge (initiée par le patient)
router.get('/demandes-recues', verifyToken, checkRole('medecin'), getDemandesRecues);

// Route pour obtenir la liste des patients
router.get('/patients', verifyToken, checkRole('medecin'), getMesPatients);

//Route pour saisir un suivi médical pour un patient qu’il suit déjà
router.post('/suivi', verifyToken, checkRole('medecin'), ajouterSuivi);

// Route pour obtenir le suivi complet d'un patient
router.get('/suivis/:patient_id', verifyToken, checkRole('medecin'), getSuivisPatient);

// Route pour accepter ou refuser le suivi d'un patient
router.put('/demande/:id/accepter', verifyToken, checkRole('medecin'), accepterDemande);
router.put('/demande/:id/refuser', verifyToken, checkRole('medecin'), refuserDemande);

// Route pour supprimer/modifier un suivi
router.put('/suivi/:id', verifyToken, checkRole('medecin'), modifierSuivi);
router.delete('/suivi/:id', verifyToken, checkRole('medecin'), supprimerSuivi);

export default router;
