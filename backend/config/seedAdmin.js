import bcrypt from 'bcrypt';
import pool from './db.js';

async function seedAdmin() {
    const first_name = 'Adham';
    const last_name = 'Charafeddine';
    const phone_number = '786880214';
    const password = 'admin';
    const role = 'admin';
    const is_validated = true;

    try {
        // Vérifie si l’admin existe déjà
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE phone_number = $1',
            [phone_number]
        );

        if (rows.length > 0) {
            console.log('⚠️ Un utilisateur avec ce numéro existe déjà.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, phone_number, password, role, is_validated)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, phone_number, role`,
            [first_name, last_name, phone_number, hashedPassword, role, is_validated]
        );

        console.log('✅ Admin créé avec succès :');
        console.log(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur lors de la création de l’admin :', error.message);
    } finally {
        pool.end(); // Termine la connexion PostgreSQL proprement
    }
}

seedAdmin();