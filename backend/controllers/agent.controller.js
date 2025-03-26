import pool from '../config/db.js';

export async function updateAgentInfo(req, res) {
    const userId = req.user?.id;
    const { region, structure_sante, poste, justificatif_url } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO agents (user_id, region, structure_sante, poste, justificatif_url, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING *`,
            [userId, region, structure_sante, poste, justificatif_url]
        );

        return res.status(200).json({
            success: true,
            message: 'Informations de l’agent enregistrées avec succès.',
            agent: result.rows[0],
        });
    } catch (error) {
        console.error('Erreur updateAgentInfo:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Erreur lors de l’enregistrement des informations.',
        });
    }
}
