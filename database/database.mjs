import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import { DB_FILE, DB_SCHEMA } from "../config.mjs";

let db;

export async function initDB() {
  db = await open({ filename: DB_FILE, driver: sqlite3.Database });
  const schema = fs.readFileSync(DB_SCHEMA, "utf8");
  await db.exec(schema);
  return db;
}

export function getDB() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

export async function createLink(code, url) {
  const now = new Date().toISOString();
  await getDB().run(
    "INSERT INTO links (code, url, created_at, visits) VALUES (?, ?, ?, 0)",
    [code, url, now]
  );
  return { code, url, created_at: now, visits: 0 };
}

export async function getLink(code) {
  return getDB().get("SELECT * FROM links WHERE code = ?", [code]);
}

export async function incVisit(code) {
  await getDB().run("UPDATE links SET visits = visits + 1 WHERE code = ?", [code]);
}

export async function countLinks() {
  const row = await getDB().get("SELECT COUNT(*) as c FROM links");
  return row.c;
}
