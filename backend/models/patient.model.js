import pool from '../config/db.js';

export async function createPatient({
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
                                    }) {
    const result = await pool.query(
        `INSERT INTO patients (
            user_id, sexe, date_naissance, adresse, ville,
            medecin_id, profession, niveau_scolaire,
            situation_familiale, nombre_enfants, telephone_proche, groupe_sanguin
        ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11, $12
        )
        RETURNING *`,
        [
            user_id, sexe, date_naissance, adresse, ville,
            medecin_id, profession, niveau_scolaire,
            situation_familiale, nombre_enfants, telephone_proche, groupe_sanguin
        ]
    );
    return result.rows[0];
}

export async function getPatientByUserId(user_id) {
    const result = await pool.query(`SELECT * FROM patients WHERE user_id = $1`, [user_id]);
    return result.rows[0];
}
