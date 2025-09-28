import express from "express";
import { createLink, getLink, incVisit, countLinks } from "../database/database.mjs";
import { LINK_LEN } from "../config.mjs";

const router = express.Router();

// Générateur simple de code
function genCode(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// GET / → page d’accueil ou JSON
router.get("/", async (req, res, next) => {
  try {
    const total = await countLinks();
    res.format({
      "application/json": () => res.json({ count: total }),
      "text/html": () => res.render("root", { count: total }),
      default: () => res.status(406).send("Not Acceptable")
    });
  } catch (e) {
    next(e);
  }
});

// POST / → création d’un lien
router.post("/", async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || !/^https?:\/\/.+/.test(url)) {
      return res.status(400).format({
        "application/json": () => res.json({ error: "Invalid URL" }),
        "text/html": () => res.send("<h1>URL invalide</h1>"),
        default: () => res.status(406).send("Not Acceptable")
      });
    }

    const code = genCode(LINK_LEN);
    const link = await createLink(code, url);

    res.format({
      "application/json": () => res.json(link),
      "text/html": () => res.render("link_created", link),
      default: () => res.status(406).send("Not Acceptable")
    });

  } catch (e) {
    next(e);
  }
});

// GET /:code → JSON ou redirection HTML
router.get("/:code", async (req, res, next) => {
  try {
    const link = await getLink(req.params.code);
    if (!link) return res.status(404).send("Not found");

    res.format({
      "application/json": () => res.json(link),
      "text/html": async () => {
        await incVisit(req.params.code);
        res.set("Cache-Control", "no-store");
        res.redirect(link.url);
      },
      default: () => res.status(406).send("Not Acceptable")
    });

  } catch (e) {
    next(e);
  }
});

export default router;
