import { Router, type IRouter } from "express";
import { checkAdminCredentials, createAdminToken, isAdminLoginConfigured } from "../lib/auth";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  if (!isAdminLoginConfigured()) {
    res.status(503).json({ error: "Admin login is not configured on the server" }); return;
  }
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !checkAdminCredentials(email, password)) {
    res.status(401).json({ error: "Invalid email or password" }); return;
  }
  res.json({ token: createAdminToken() });
});

export default router;
