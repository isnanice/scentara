import express from "express";
import { ScentProfileController } from "../controllers/scentProfileController.js";

const router = express.Router();

router.get("/", ScentProfileController.getAll);

export default router;
