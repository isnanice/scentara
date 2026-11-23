import express from "express";
import { ReviewController } from "../controllers/reviewController.js";

const router = express.Router();

// CRUD review untuk satu parfum atau semua ulasan
router.get("/reviews", ReviewController.getAll);
router.get("/perfumes/:perfumeId/reviews", ReviewController.getByPerfumeId);
router.post("/perfumes/:perfumeId/reviews", ReviewController.create);
router.put("/reviews/:id", ReviewController.update);
router.delete("/reviews/:id", ReviewController.delete);

export default router;

