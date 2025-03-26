import jwt from 'jsonwebtoken';

// Middleware pour vérifier l'authentification
export function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

    // Vérifie si l'utilisateur est actif
    if (verified.is_active === false) {
      return res.status(403).json({ success: false, message: "Compte désactivé." });
    }

    req.user = verified; // Attacher l'utilisateur vérifié à la requête
    next(); // Passer au middleware suivant
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token invalide.' });
  }
}
