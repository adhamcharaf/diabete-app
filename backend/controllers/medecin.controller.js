import pool from '../config/db.js';

/**
 * Met à jour les informations du médecin connecté
 */
export async function updateMedecinInfo(req, res) {
    const userId = req.user.id;
    const { specialite, region, adresse, numero_ordre_medecin, justificatif_url } = req.body;

    try {
        // Vérifier si un profil existe déjà pour ce médecin
        const checkQuery = `SELECT * FROM medecins WHERE user_id = $1`;
        const checkResult = await pool.query(checkQuery, [userId]);

        if (checkResult.rows.length > 0) {
            // Mettre à jour le profil existant
            const updateQuery = `
                UPDATE medecins 
                SET specialite = $1, region = $2, adresse = $3, numero_ordre_medecin = $4, justificatif_url = $5
                WHERE user_id = $6
                RETURNING *
            `;
            const values = [specialite, region, adresse, numero_ordre_medecin, justificatif_url, userId];
            const result = await pool.query(updateQuery, values);

            return res.status(200).json({
                success: true,
                message: "Profil mis à jour",
                medecin: result.rows[0],
            });
        } else {
            // Créer un nouveau profil
            const insertQuery = `
                INSERT INTO medecins (user_id, specialite, region, adresse, numero_ordre_medecin, justificatif_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const values = [userId, specialite, region, adresse, numero_ordre_medecin, justificatif_url];
            const result = await pool.query(insertQuery, values);

            return res.status(201).json({
                success: true,
                message: "Profil créé avec succès",
                medecin: result.rows[0],
            });
        }
    } catch (error) {
        console.error("Erreur dans updateMedecinInfo:", error.message);
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour des informations du médecin.",
        });
    }
}

// Créer une demande de prise en charge (médecin → patient)
export async function demanderPriseEnCharge(req, res) {
    const medecinId = req.user.id; // depuis le token
    const { patient_id } = req.body;

    try {
        // Vérifie que le patient existe et n’a pas encore de médecin
        const { rows: patients } = await pool.query(
            `SELECT * FROM users WHERE id = $1 AND role = 'patient'`,
            [patient_id]
        );

        if (patients.length === 0) {
            return res.status(404).json({ success: false, message: "Patient introuvable." });
        }

        const patient = patients[0];

        if (patient.medecin_id) {
            return res.status(400).json({ success: false, message: "Ce patient est déjà suivi." });
        }

        // Vérifie si le patient a déjà fait une demande vers ce médecin
        const { rows: demandesInverse } = await pool.query(
            `SELECT * FROM demandes_prises_en_charge
             WHERE patient_id = $1 AND medecin_id = $2
               AND initiateur = 'patient' AND statut = 'en_attente'`,
            [patient_id, medecinId]
        );

        if (demandesInverse.length > 0) {
            // Match croisé détecté
            await pool.query(
                `UPDATE demandes_prises_en_charge
         SET statut = 'accepte'
         WHERE patient_id = $1 AND medecin_id = $2`,
                [patient_id, medecinId]
            );

            await pool.query(
                `INSERT INTO demandes_prises_en_charge (patient_id, medecin_id, initiateur, statut)
         VALUES ($1, $2, 'medecin', 'accepte')`,
                [patient_id, medecinId]
            );

            await pool.query(
                `UPDATE patients SET medecin_id = $1 WHERE user_id = $2`,
                [medecinId, patient_id]
            );

            return res.status(200).json({
                success: true,
                message: "Match croisé détecté. Patient pris en charge automatiquement."
            });
        }


        // Vérifie qu'une demande n’existe pas déjà
        const { rows: existing } = await pool.query(
            `SELECT * FROM demandes_prises_en_charge
       WHERE patient_id = $1 AND medecin_id = $2 AND statut = 'en_attente'`,
            [patient_id, medecinId]
        );

        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: "Demande déjà en attente." });
        }

        // Sinon, créer la demande (simple)
        await pool.query(
            `INSERT INTO demandes_prises_en_charge (patient_id, medecin_id, initiateur)
             VALUES ($1, $2, 'medecin')`,
            [patient_id, medecinId]
        );

        res.status(201).json({ success: true, message: "Demande envoyée au patient." });

    } catch (error) {
        console.error("Erreur demanderPriseEnCharge:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

// Accepter une demande de prise en charge (patient → médecin)
export async function getDemandesRecues(req, res) {
    const medecinId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT d.id AS demande_id, u.id AS patient_id, u.first_name, u.last_name, u.phone_number, d.date_creation
       FROM demandes_prises_en_charge d
       JOIN users u ON d.patient_id = u.id
       WHERE d.medecin_id = $1 AND d.initiateur = 'patient' AND d.statut = 'en_attente'`,
            [medecinId]
        );

        res.json({ success: true, demandes: result.rows });
    } catch (error) {
        console.error("Erreur getDemandesRecues:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

// Obtenir la liste de ses patients
export async function getMesPatients(req, res) {
    const medecinId = req.user.id;

    try {
        const result = await pool.query(
            `SELECT u.id AS patient_id, u.first_name, u.last_name, u.phone_number, u.date_naissance, u.sexe, p.ville
       FROM patients p
       JOIN users u ON p.user_id = u.id
       WHERE p.medecin_id = $1`,
            [medecinId]
        );

        res.json({
            success: true,
            patients: result.rows
        });
    } catch (error) {
        console.error("Erreur getMesPatients:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

//ajouter un suivi pour un patient
export async function ajouterSuivi(req, res) {
    const medecinId = req.user.id;
    const {
        patient_id,
        glycémie,
        a_jeun,
        tension,
        poids,
        symptomes,
        traitement,
        remarques

    } = req.body;

    try {
        // Vérifie que le patient est bien suivi par ce médecin
        const { rows: patients } = await pool.query(
            `SELECT * FROM patients WHERE user_id = $1 AND medecin_id = $2`,
            [patient_id, medecinId]
        );

        if (patients.length === 0) {
            return res.status(403).json({ success: false, message: "Ce patient ne vous est pas attribué." });
        }

        // Insertion dans la table suivis
        await pool.query(
            `INSERT INTO suivis (patient_id, medecin_id, glycémie, a_jeun, tension, poids, symptomes, traitement, remarques, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'medecin')`,
            [patient_id, medecinId, glycémie, a_jeun, tension, poids, symptomes, traitement, remarques]
        );

        res.status(201).json({ success: true, message: "Suivi ajouté avec succès." });

    } catch (error) {
        console.error("Erreur ajouterSuivi:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

//obtenir le suivi d'un patient
export async function getSuivisPatient(req, res) {
    const medecinId = req.user.id;
    const patientId = req.params.patient_id;

    try {
        // Vérifie que le médecin suit bien ce patient
        const { rows: patients } = await pool.query(
            `SELECT * FROM patients WHERE user_id = $1 AND medecin_id = $2`,
            [patientId, medecinId]
        );

        if (patients.length === 0) {
            return res.status(403).json({ success: false, message: "Vous ne suivez pas ce patient." });
        }

        const { rows: suivis } = await pool.query(
            `SELECT id, date_suivi, glycémie, a_jeun, tension, poids, symptomes, traitement, remarques, type
       FROM suivis
       WHERE patient_id = $1
       ORDER BY date_suivi DESC`,
            [patientId]
        );

        res.json({ success: true, suivis });

    } catch (error) {
        console.error("Erreur getSuivisPatient:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

// accepter une demande de patient
export async function accepterDemande(req, res) {
    const medecinId = req.user.id;
    const { id } = req.params; // ID de la demande

    try {
        // Récupère la demande
        const { rows } = await pool.query(
            `SELECT * FROM demandes_prises_en_charge WHERE id = $1 AND medecin_id = $2 AND statut = 'en_attente'`,
            [id, medecinId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Demande non trouvée ou déjà traitée." });
        }

        const demande = rows[0];

        // Affecte le médecin au patient
        await pool.query(
            `UPDATE patients SET medecin_id = $1 WHERE user_id = $2`,
            [medecinId, demande.patient_id]
        );

        // Met à jour la demande
        await pool.query(
            `UPDATE demandes_prises_en_charge SET statut = 'accepte' WHERE id = $1`,
            [id]
        );

        res.json({ success: true, message: "Demande acceptée. Vous suivez maintenant ce patient." });

    } catch (error) {
        console.error("Erreur accepterDemande:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

//refuser une demande de patient
export async function refuserDemande(req, res) {
    const medecinId = req.user.id;
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query(
            `UPDATE demandes_prises_en_charge
       SET statut = 'refuse'
       WHERE id = $1 AND medecin_id = $2 AND statut = 'en_attente'`,
            [id, medecinId]
        );

        if (rowCount === 0) {
            return res.status(404).json({ success: false, message: "Demande non trouvée ou déjà traitée." });
        }

        res.json({ success: true, message: "Demande refusée." });

    } catch (error) {
        console.error("Erreur refuserDemande:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

// Modifier un suivi
export async function modifierSuivi(req, res) {
    const medecinId = req.user.id;
    const { id } = req.params;
    const {
        glycémie,
        tension,
        poids,
        symptomes,
        traitement,
        remarques
    } = req.body;

    try {
        // Vérifie que le suivi existe et qu'il appartient bien à ce médecin
        const { rows } = await pool.query(
            `SELECT * FROM suivis WHERE id = $1 AND medecin_id = $2 AND type = 'medecin'`,
            [id, medecinId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Modification non autorisée." });
        }

        const suivi = rows[0];

        // Vérifie que la date du suivi est inférieure à 3 jours
        const dateSuivi = new Date(suivi.date_suivi);
        const now = new Date();
        const diffEnJours = (now - dateSuivi) / (1000 * 60 * 60 * 24);

        if (diffEnJours > 3) {
            return res.status(403).json({ success: false, message: "Modification non autorisée après 3 jours." });
        }

        // Mise à jour des données
        await pool.query(
            `UPDATE suivis
             SET glycémie = $1, tension = $2, poids = $3, symptomes = $4, traitement = $5, remarques = $6
             WHERE id = $7`,
            [glycémie, tension, poids, symptomes, traitement, remarques, id]
        );

        // Journalisation de la modification
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, cible, details)
       VALUES ($1, 'update', 'suivi', $2)`,
            [medecinId, JSON.stringify(suivi)]
        );

        res.json({ success: true, message: "Suivi modifié avec succès et journalisé." });

    } catch (error) {
        console.error("Erreur modifierSuivi:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}


// Supprimer un suivi
export async function supprimerSuivi(req, res) {
    const medecinId = req.user.id;
    const { id } = req.params;

    try {
        // Vérifie que le suivi existe, appartient au médecin et est de type 'medecin'
        const { rows } = await pool.query(
            `SELECT * FROM suivis WHERE id = $1 AND medecin_id = $2 AND type = 'medecin'`,
            [id, medecinId]
        );

        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Suppression non autorisée ou suivi inexistant." });
        }

        const suivi = rows[0];

        // Blocage si plus de 3 jours
        const dateSuivi = new Date(suivi.date_suivi);
        const now = new Date();
        const diffEnJours = (now - dateSuivi) / (1000 * 60 * 60 * 24);

        if (diffEnJours > 3) {
            return res.status(403).json({ success: false, message: "Suppression non autorisée après 3 jours." });
        }

        // Suppression du suivi
        await pool.query(
            `DELETE FROM suivis WHERE id = $1`,
            [id]
        );

        // Journalisation de la suppression
        await pool.query(
            `INSERT INTO audit_logs (user_id, action, cible, details)
       VALUES ($1, 'delete', 'suivi', $2)`,
            [medecinId, JSON.stringify(suivi)]
        );

        res.json({ success: true, message: "Suivi supprimé avec succès et action journalisée." });

    } catch (error) {
        console.error("Erreur supprimerSuivi:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}


// Alerte
export async function getAlertes(req, res) {
    const medecinId = req.user.id;

    try {
        const alertes = [];
        const aujourdHui = new Date();

        // 1️⃣ Récupérer tous les patients suivis par ce médecin
        const { rows: patients } = await pool.query(
            `SELECT u.id AS patient_id, u.first_name, u.last_name
             FROM users u
                      JOIN patients p ON p.user_id = u.id
             WHERE p.medecin_id = $1`,
            [medecinId]
        );

        for (const patient of patients) {
            const patientId = patient.patient_id;
            const fullName = `${patient.first_name} ${patient.last_name}`;

            // 2️⃣ Récupérer tous les suivis du patient (triés du plus récent au plus ancien)
            const { rows: suivis } = await pool.query(
                `SELECT * FROM suivis WHERE patient_id = $1 ORDER BY date_suivi DESC`,
                [patientId]
            );

            if (suivis.length === 0) continue;

            // 3️⃣ Hyperglycémie critique > 250
            const critique = suivis.find(s => s.glycémie > 250);
            if (critique) {
                alertes.push({
                    patient_id: patientId,
                    patient_name: fullName,
                    alerte: "Hyperglycémie critique",
                    type: "glycemie_critique",
                    gravite: "haute",
                    valeur: critique.glycémie,
                    date: critique.date_suivi
                });
            }

            // 4️⃣ Hypoglycémie < 70
            const hypo = suivis.find(s => s.glycémie < 70);
            if (hypo) {
                alertes.push({
                    patient_id: patientId,
                    patient_name: fullName,
                    alerte: "Hypoglycémie détectée",
                    type: "hypoglycemie",
                    gravite: "haute",
                    valeur: hypo.glycémie,
                    date: hypo.date_suivi
                });
            }

            // 5️⃣ Hyperglycémies modérées > 180 (au moins 3 fois)
            const glyHighs = suivis.filter(s => s.glycémie > 180);
            if (glyHighs.length >= 3) {
                alertes.push({
                    patient_id: patientId,
                    patient_name: fullName,
                    alerte: "Hyperglycémie persistante",
                    type: "glycemie_moderée",
                    gravite: "moyenne",
                    valeur: glyHighs.map(s => s.glycémie),
                    date: glyHighs[0].date_suivi
                });
            }

            // 6️⃣ Aucun suivi depuis 30 jours
            const dernierSuivi = new Date(suivis[0].date_suivi);
            const diffJours = (aujourdHui - dernierSuivi) / (1000 * 60 * 60 * 24);
            if (diffJours > 30) {
                alertes.push({
                    patient_id: patientId,
                    patient_name: fullName,
                    alerte: "Aucun suivi depuis 30 jours",
                    type: "absence_suivi",
                    gravite: "moyenne",
                    valeur: `${Math.floor(diffJours)} jours`,
                    date: suivis[0].date_suivi
                });
            }

            // 7️⃣ Perte de poids rapide > 5kg sur 30 jours
            const suivis30Jours = suivis.filter(s => {
                const date = new Date(s.date_suivi);
                return (aujourdHui - date) / (1000 * 60 * 60 * 24) <= 30;
            });

            if (suivis30Jours.length >= 2) {
                const poidsAncien = suivis30Jours[suivis30Jours.length - 1].poids;
                const poidsRecent = suivis30Jours[0].poids;
                const perte = poidsAncien - poidsRecent;

                if (perte > 5) {
                    alertes.push({
                        patient_id: patientId,
                        patient_name: fullName,
                        alerte: "Perte de poids rapide",
                        type: "perte_poids",
                        gravite: "moyenne",
                        valeur: `${perte.toFixed(1)} kg en 30j`,
                        date: suivis30Jours[0].date_suivi
                    });
                }
            }

            // 8️⃣ Symptômes critiques détectés
            const symptomesCritiques = ["douleur thoracique", "malaise", "palpitations", "vision trouble"];
            const suiviCritique = suivis.find(s =>
                s.symptomes &&
                symptomesCritiques.some(crit => s.symptomes.toLowerCase().includes(crit))
            );

            if (suiviCritique) {
                alertes.push({
                    patient_id: patientId,
                    patient_name: fullName,
                    alerte: "Symptôme critique détecté",
                    type: "symptome_critique",
                    gravite: "moyenne",
                    valeur: suiviCritique.symptomes,
                    date: suiviCritique.date_suivi
                });
            }
        }

        res.json({ success: true, alertes });

    } catch (error) {
        console.error("Erreur getAlertes:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}





