import express from "express";
import authenticateToken from "../middleware/authenticateToken";
import multer from "multer";
import { fileStorage, imageStorage } from "../utils/fileUtils";
import {
  deleteInvoice,
  downloadFile,
  getInvoice,
  getInvoices,
  updateInvoice,
  uploadInvoice,
  uploadPicture,
} from "../controllers/fileController";

const router = express.Router();

const uploadFiles = multer({ storage: fileStorage });
const uploadImages = multer({ storage: imageStorage });

router.post(
  "/upload/picture",
  authenticateToken,
  uploadImages.single("file"),
  uploadPicture
);
router.post(
  "/upload/invoice",
  authenticateToken,
  uploadFiles.single("file"),
  uploadInvoice
);

router.get("/invoice", authenticateToken, getInvoices);
router.post("/invoice", authenticateToken, getInvoice);
router.put("/invoice/:id", authenticateToken, updateInvoice);
router.delete("/invoice/:id", authenticateToken, deleteInvoice);

router.get("/download/:filename", authenticateToken, downloadFile);

export default router;
