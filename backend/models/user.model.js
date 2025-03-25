import pool from '../config/db.js';

/**
 * Crée un utilisateur dans la base de données
 * @param {Object} user - Données utilisateur
 * @param {string} user.first_name
 * @param {string} user.last_name
 * @param {string} user.phone_number
 * @param {string} user.password
 * @param {string} user.role
 * @param {boolean} user.is_validated
 */
export async function createUser({ first_name, last_name, phone_number, password, role, is_validated }) {
    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, phone_number, password, role, is_validated)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [first_name, last_name, phone_number, password, role, is_validated]
    );
    return result.rows[0];
}

/**
 * Récupère un utilisateur par son numéro de téléphone
 * @param {string} phone_number
 */
export async function getUserByPhoneNumber(phone_number) {
    try {
        const query = `
      SELECT id, first_name, last_name, phone_number, password, role, is_validated
      FROM users
      WHERE phone_number = $1
    `;
        const { rows } = await pool.query(query, [phone_number]);
        return rows[0];
    } catch (error) {
        console.error('Erreur dans getUserByPhoneNumber:', error.message);
        throw error;
    }
}
