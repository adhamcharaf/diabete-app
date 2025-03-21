import pool from '../config/db.js';

/**
 * Crée un utilisateur dans la base de données
 * @param {Object} user - Données utilisateur
 * @param {string} user.full_name
 * @param {string} user.phone_number
 * @param {string} user.password_hash
 * @param {string} user.role
 */
export async function createUser({ full_name, phone_number, password, role }) {
  const query = `
    INSERT INTO users (full_name, phone_number, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, phone_number, role, created_at
  `;

  const values = [full_name, phone_number, password, role];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Fonction pour récupérer un utilisateur par son numéro de téléphone
export async function getUserByPhoneNumber(phone_number) {
    try {
      const query = 'SELECT id, full_name, phone_number, password, role FROM users WHERE phone_number = $1';
      const { rows } = await pool.query(query, [phone_number]);
      return rows[0]; // Retourne l'utilisateur s'il existe
    } catch (error) {
      console.error('Erreur dans getUserByPhoneNumber:', error.message);
      throw error;
    }
  }