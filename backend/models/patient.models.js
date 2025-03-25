import db from '../config/db.js';
import pkg from 'sequelize';
const { DataTypes } = pkg;

const Patient = db.define('patients', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    sexe: { type: DataTypes.STRING, allowNull: false },
    date_naissance: { type: DataTypes.DATEONLY, allowNull: false },
    adresse: { type: DataTypes.TEXT, allowNull: true },
    ville: { type: DataTypes.STRING, allowNull: true },
    medecin_id: { type: DataTypes.INTEGER, allowNull: true },
    profession: { type: DataTypes.STRING, allowNull: true },
    niveau_scolaire: { type: DataTypes.STRING, allowNull: true },
    situation_familiale: { type: DataTypes.STRING, allowNull: true },
    nombre_enfants: { type: DataTypes.INTEGER, allowNull: true },
    telephone_proche: { type: DataTypes.STRING, allowNull: true },
    groupe_sanguin: { type: DataTypes.STRING, allowNull: true },
}, {
    timestamps: false
});

export default Patient;
