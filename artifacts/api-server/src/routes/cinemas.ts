import { Router, type IRouter } from "express";
import { db, cinemasTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cinemas", async (_req, res) => {
  try {
    const cinemas = await db.select().from(cinemasTable);
    res.json(cinemas.map(c => ({ id: String(c.id), name: c.name, address: c.address, city: c.city })));
  } catch {
    res.status(500).json({ error: "Failed to fetch cinemas" });
  }
});

router.post("/cinemas", async (req, res) => {
  try {
    const { name, address, city } = req.body;
    if (!name || !address || !city) { res.status(400).json({ error: "Missing required fields" }); return; }
    const [cinema] = await db.insert(cinemasTable).values({ name, address, city }).returning();
    res.status(201).json({ id: String(cinema.id), name: cinema.name, address: cinema.address, city: cinema.city });
  } catch {
    res.status(500).json({ error: "Failed to create cinema" });
  }
});

export default router;
