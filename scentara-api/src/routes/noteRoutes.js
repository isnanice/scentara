import express from "express";
import { NoteController } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", NoteController.getAll);
router.get("/categories", NoteController.getCategories);
router.get("/:id", NoteController.getById);

export default router;
