const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log("✅ Connexion à PostgreSQL réussie !");
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à PostgreSQL :", err);
  });

module.exports = pool;
