import express from "express";
import { initDB } from "./database/database.mjs";
import apiV2 from "./router/api-v2.mjs";
import { PORT } from "./config.mjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // pour POST formulaire

// Pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static("static"));


// config EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// API v2
app.use("/api-v2", apiV2);

app.get("/error", () => { throw new Error("Erreur 500 testée"); });

// démarrage
initDB().then(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
});
