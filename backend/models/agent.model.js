import pool from '../config/db.js';

export async function createAgent({ user_id, region, structure_sante, poste, justificatif_url }) {
    const result = await pool.query(
        `INSERT INTO agents (user_id, region, structure_sante, poste, justificatif_url, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [user_id, region, structure_sante, poste, justificatif_url]
    );
    return result.rows[0];
}

export async function getAgentByUserId(user_id) {
    const result = await pool.query(`SELECT * FROM agents WHERE user_id = $1`, [user_id]);
    return result.rows[0];
}
