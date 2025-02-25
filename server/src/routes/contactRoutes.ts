import express from "express";
import {
  createContactForm,
  getContactForm,
} from "../controllers/contactController";

const router = express.Router();

router.use("/", getContactForm);
router.use("/", createContactForm);

export default router;
