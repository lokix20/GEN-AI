import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { asyncHandler, HttpError } from "../../middleware/error.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import { getStorageProvider } from "../../providers/storage/factory.js";

const router = Router();

router.post(
  "/image",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const result = await getStorageProvider().upload(
      { buffer: req.file.buffer, mimeType: req.file.mimetype, originalName: req.file.originalname },
      "chat",
    );

    res.status(201).json(result);
  }),
);

export { router as uploadsRoutes };
