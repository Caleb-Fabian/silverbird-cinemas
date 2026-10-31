import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { logger } from "./logger";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

// Without AUTH_SECRET a random one is used, so admins are logged out whenever the server restarts
const secret = process.env["AUTH_SECRET"] || randomBytes(32).toString("hex");
if (!process.env["AUTH_SECRET"]) {
  logger.warn("AUTH_SECRET is not set; admin sessions will end when the server restarts");
}

function sign(payload: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function checkAdminCredentials(email: string, password: string) {
  const adminEmail = process.env["ADMIN_EMAIL"];
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminEmail || !adminPassword) return false;
  // Evaluate both so a wrong email takes as long as a wrong password
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, adminPassword);
  return emailOk && passwordOk;
}

export function isAdminLoginConfigured() {
  return Boolean(process.env["ADMIN_EMAIL"] && process.env["ADMIN_PASSWORD"]);
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function isValidAdminToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number };
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  const header = req.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !isValidAdminToken(token)) {
    res.status(401).json({ error: "Admin login required" });
    return;
  }
  next();
};
