// 📁 backend/controllers/admin.controller.js

import pool from '../config/db.js';
import bcrypt from 'bcrypt';

// Récupère les médecins non validés
export async function getMedecinsAValider(req, res) {
    try {
        const result = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.phone_number, m.specialite, m.justificatif_url
       FROM users u
       JOIN medecins m ON u.id = m.user_id
       WHERE u.role = 'medecin' AND u.is_validated = false`
        );
        res.json({ success: true, medecins: result.rows });
    } catch (error) {
        console.error('Erreur getMedecinsAValider:', error.message);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
}

// Valide un médecin
export async function validerMedecin(req, res) {
    const userId = req.params.id;
    try {
        const result = await pool.query(
            `UPDATE users SET is_validated = true WHERE id = $1 RETURNING *`,
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Médecin introuvable." });
        }
        res.json({ success: true, message: "Médecin validé avec succès", user: result.rows[0] });
    } catch (error) {
        console.error('Erreur validerMedecin:', error.message);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
}

// Supprime un médecin non validé
export async function rejeterMedecin(req, res) {
    const userId = req.params.id;
    try {
        const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
        if (!rows.length || rows[0].role !== 'medecin' || rows[0].is_validated) {
            return res.status(400).json({ success: false, message: "Action non autorisée." });
        }

        await pool.query(`DELETE FROM medecins WHERE user_id = $1`, [userId]);
        await pool.query(`DELETE FROM users WHERE id = $1`, [userId]);

        res.json({ success: true, message: "Médecin supprimé avec succès." });
    } catch (error) {
        console.error('Erreur rejeterMedecin:', error.message);
        res.status(500).json({ success: false, message: 'Erreur serveur.' });
    }
}

// Crée un autre admin
export async function createAdmin(req, res) {
    const { first_name, last_name, phone_number, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existing = await pool.query(`SELECT * FROM users WHERE phone_number = $1`, [phone_number]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Ce numéro est déjà utilisé." });
        }

        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, phone_number, password, role, is_validated)
       VALUES ($1, $2, $3, $4, 'admin', true)
       RETURNING id, first_name, last_name, phone_number, role`,
            [first_name, last_name, phone_number, hashedPassword]
        );

        res.status(201).json({ success: true, message: "Admin créé", user: result.rows[0] });
    } catch (error) {
        console.error("Erreur createAdmin:", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

//desactiver un utilisateur
export async function desactiverUtilisateur(req, res) {
    const userId = req.params.id;
    try {
        const result = await pool.query(
            `UPDATE users SET is_active = false WHERE id = $1 RETURNING *`,
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });
        }
        res.json({ success: true, message: "Utilisateur désactivé.", user: result.rows[0] });
    } catch (error) {
        console.error("Erreur désactivation :", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

//activer un utilisateur
export async function activerUtilisateur(req, res) {
    const userId = req.params.id;
    try {
        const result = await pool.query(
            `UPDATE users SET is_active = true WHERE id = $1 RETURNING *`,
            [userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Utilisateur introuvable." });
        }
        res.json({ success: true, message: "Utilisateur réactivé.", user: result.rows[0] });
    } catch (error) {
        console.error("Erreur activation :", error.message);
        res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}

