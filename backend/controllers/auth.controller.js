import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByPhoneNumber } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();


export async function register(req, res) {
  const { full_name, phone_number, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Déterminer automatiquement la validation
    const is_validated = (role === 'patient'|| role === 'agent');

    const newUser = await createUser({
      full_name,
      phone_number,
      password: hashedPassword,
      role,
      is_validated
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: newUser,
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Ce numéro de téléphone est déjà utilisé.',
      });
    }

    console.error('Erreur dans register:', error.message);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l’inscription",
    });
  }
}


// fonction de connexion
export async function login(req, res) {
    const { phone_number, password } = req.body;
  
    try {
      // Vérifier si l'utilisateur existe
      const user = await getUserByPhoneNumber(phone_number);
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }
  
      // Vérifier le mot de passe
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
      }

      // 🔐 Vérification de la validation du compte
      if (user.role === 'medecin' && !user.is_validated) {
        return res.status(403).json({
          success: false,
          message: "Votre compte n'a pas encore été validé par l'administration.",
        });
      }
  
      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id, phone_number: user.phone_number, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Envoyer la réponse avec le token
      res.json({
        success: true,
        message: "Connexion réussie",
        token,
        user: { id: user.id, full_name: user.full_name, phone_number: user.phone_number, role: user.role }
      });
  
    } catch (error) {
      console.error("Erreur dans login:", error.message);
      res.status(500).json({ success: false, message: "Erreur lors de la connexion" });
    }
  }


