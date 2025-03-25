import db from '../config/db.js';
import pkg from 'sequelize';
const { DataTypes } = pkg;

const Medecin = db.define('medecins', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    specialite: { type: DataTypes.STRING, allowNull: true },
    region: { type: DataTypes.STRING, allowNull: true },
    adresse: { type: DataTypes.TEXT, allowNull: true },
    numero_ordre_medecin: { type: DataTypes.STRING, allowNull: true },
    justificatif_url: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false
});

export default Medecin;
