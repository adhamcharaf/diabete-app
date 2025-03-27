import pool from '../config/db.js';

// Création d’un patient après inscription
export async function createPatient(req, res) {
    const {
        user_id,
        sexe,
        date_naissance,
        adresse,
        ville,
        medecin_id,
        profession,
        niveau_scolaire,
        situation_familiale,
        nombre_enfants,
        telephone_proche,
        groupe_sanguin
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO patients (
        user_id,
        adresse,
        ville,
        medecin_id,
        profession,
        situation_familiale,
        nombre_enfants,
        telephone_proche,
        groupe_sanguin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
            [
                user_id,
                sexe,
                date_naissance,
                adresse,
                ville,
                medecin_id,
                profession,
                niveau_scolaire,
                situation_familiale,
                nombre_enfants,
                telephone_proche,
                groupe_sanguin
            ]
        );

        res.status(201).json({ success: true, patient: result.rows[0] });
    } catch (error) {
        console.error("Erreur dans createPatient:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}
