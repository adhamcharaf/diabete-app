const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./config/db"); // juste pour tester

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend opérationnel !");
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
