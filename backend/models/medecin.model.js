import pool from '../config/db.js';

export async function createMedecin({ user_id, specialite, region, adresse, numero_ordre_medecin, justificatif_url }) {
    const result = await pool.query(
        `INSERT INTO medecins (user_id, specialite, region, adresse, numero_ordre_medecin, justificatif_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING *`,
        [user_id, specialite, region, adresse, numero_ordre_medecin, justificatif_url]
    );
    return result.rows[0];
}

export async function getMedecinByUserId(user_id) {
    const result = await pool.query(`SELECT * FROM medecins WHERE user_id = $1`, [user_id]);
    return result.rows[0];
}
