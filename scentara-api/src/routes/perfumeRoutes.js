import express from "express";
import { PerfumeController } from "../controllers/perfumeController.js";

const router = express.Router();

router.get("/", PerfumeController.getAll);
router.get("/:id", PerfumeController.getById);

export default router;
