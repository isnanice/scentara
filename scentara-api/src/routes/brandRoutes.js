import express from "express";
import { BrandController } from "../controllers/brandController.js";

const router = express.Router();

router.get("/", BrandController.getAll);

export default router;
