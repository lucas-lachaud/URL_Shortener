import express from "express";
import { createLink, getLink, incVisit, countLinks } from "../database/database.mjs";
import { LINK_LEN } from "../config.mjs";

const router = express.Router();

function genCode(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return [...Array(len)].map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// GET / → nombre de liens
router.get("/", async (req, res, next) => {
  try {
    res.json({ count: await countLinks() });
  } catch (e) {
    next(e);
  }
});

// POST / → créer un lien
router.post("/", async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || !/^https?:\/\/.+/.test(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }
    const code = genCode(LINK_LEN);
    const link = await createLink(code, url);
    res.json({ short: code, ...link });
  } catch (e) {
    next(e);
  }
});

// GET /status/:code → état du lien
router.get("/status/:code", async (req, res, next) => {
  try {
    const link = await getLink(req.params.code);
    if (!link) return res.status(404).json({ error: "Not found" });
    res.json(link);
  } catch (e) {
    next(e);
  }
});

// GET /:code → redirection
router.get("/:code", async (req, res, next) => {
  try {
    const link = await getLink(req.params.code);
    if (!link) return res.status(404).json({ error: "Not found" });
    await incVisit(req.params.code);
    res.redirect(link.url);
  } catch (e) {
    next(e);
  }
});

export default router;
