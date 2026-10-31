import express, { Router, type IRouter } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

const router: IRouter = Router();

export const uploadsDir = path.resolve(process.env["UPLOADS_DIR"] ?? "uploads");
mkdirSync(uploadsDir, { recursive: true });

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => cb(null, `${randomUUID()}${allowedTypes[file.mimetype]}`),
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in allowedTypes),
});

router.use("/uploads", express.static(uploadsDir, { maxAge: "7d" }));

router.post("/uploads", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "File is too large (max 200 MB)" }); return;
    }
    if (err) { res.status(500).json({ error: "Upload failed" }); return; }
    if (!req.file) {
      res.status(400).json({ error: "Upload a JPG, PNG, WebP, GIF, MP4, WebM or MOV file" }); return;
    }
    res.status(201).json({ url: `/api/uploads/${req.file.filename}` });
  });
});

export default router;
