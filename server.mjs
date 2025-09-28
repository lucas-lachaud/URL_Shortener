import express from "express";
import { initDB } from "./database/database.mjs";
import apiV1 from "./router/api-v1.mjs";
import { PORT } from "./config.mjs";

const app = express();
app.use(express.json());

// API v1
app.use("/api-v1", apiV1);

// route de test erreur 500
app.get("/error", () => { throw new Error("Erreur 500 testée"); });

// démarrage
initDB().then(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
});
