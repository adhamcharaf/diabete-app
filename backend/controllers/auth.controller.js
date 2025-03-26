import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { createUser, getUserByPhoneNumber } from '../models/user.model.js';
import { createPatient } from '../models/patient.model.js';
import { createMedecin } from '../models/medecin.model.js';
import { createAgent } from '../models/agent.model.js';

dotenv.config();

// 🔐 Enregistrement
export async function register(req, res) {
  const {
    first_name,
    last_name,
    phone_number,
    password,
    role,
    ...additionalData
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const is_validated = role === 'patient'; // seuls les patients sont validés automatiquement

    const newUser = await createUser({
      first_name,
      last_name,
      phone_number,
      password: hashedPassword,
      role,
      is_validated,
    });

    // 👥 Création du profil lié
    if (role === 'patient') {
      await createPatient({ user_id: newUser.id, ...additionalData });
    } else if (role === 'medecin') {
      await createMedecin({ user_id: newUser.id, ...additionalData });
    } else if (role === 'agent') {
      await createAgent({ user_id: newUser.id, ...additionalData });
    }

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
      message: "Erreur lors de l'inscription",
    });
  }
}

// 🔐 Connexion
export async function login(req, res) {
  const { phone_number, password } = req.body;

  try {
    const user = await getUserByPhoneNumber(phone_number);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Compte désactivé. Veuillez contacter l’administration." });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    // ✅ Connexion autorisée même si non validé
    // Le frontend se basera sur le champ `is_validated` pour adapter l’interface

    const token = jwt.sign(
        {
          id: user.id,
          phone_number: user.phone_number,
          role: user.role,
          is_validated: user.is_validated,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role: user.role,
        is_validated: user.is_validated,
      },
    });

  } catch (error) {
    console.error("Erreur dans login:", error.message);
    res.status(500).json({ success: false, message: "Erreur lors de la connexion" });
  }
}

// 👤 Infos utilisateur connecté
export async function me(req, res) {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    console.error("Erreur dans me:", error.message);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des infos utilisateur" });
  }
}
