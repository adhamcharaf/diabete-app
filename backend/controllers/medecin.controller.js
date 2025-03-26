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

