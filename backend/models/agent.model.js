import db from '../config/db.js';
import pkg from 'sequelize';
const { DataTypes } = pkg;

const Agent = db.define('agents', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    region: { type: DataTypes.STRING, allowNull: true },
    structure_sante: { type: DataTypes.STRING, allowNull: true },
    poste: { type: DataTypes.STRING, allowNull: true },
    justificatif_url: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    timestamps: false
});

export default Agent;
