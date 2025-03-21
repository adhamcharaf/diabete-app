import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByPhoneNumber } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();


// fonction d’inscription
export async function register(req, res) {
  const { full_name, phone_number, password, role } = req.body;

  try {
    const saltRounds = 10;
    const password = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser({ full_name, phone_number, password: password, role });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: newUser,
    });
  } catch (error) {
    console.error('Erreur dans register:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l’inscription',
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


