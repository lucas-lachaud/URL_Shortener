import express from "express";
import { initDB, getLink, incVisit } from "./database/database.mjs";
import apiV2 from "./router/api-v2.mjs";
import { PORT } from "./config.mjs";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // pour POST formulaire

// Servir les fichiers statiques
app.use(express.static("static"));

// config EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// --- Swagger UI ---
const swaggerDocument = yaml.load(fs.readFileSync(path.join("./static/open-api.yaml"), "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API v2
app.use("/api-v2", apiV2);

const RESERVED_CODES = new Set(["api", "api-v1", "api-v2", "api-docs", "swagger-ui"]);

app.get("/:code([A-Za-z0-9]{3,})", async (req, res, next) => {
  const { code } = req.params;
  if (RESERVED_CODES.has(code)) return next();

  try {
    const link = await getLink(code);
    if (!link) return next();

    await incVisit(code);
    res.set("Cache-Control", "no-store");
    res.redirect(link.url);
  } catch (err) {
    next(err);
  }
});

// Route test erreur
app.get("/error", () => { throw new Error("Erreur 500 testée"); });

// démarrage
initDB().then(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
});
