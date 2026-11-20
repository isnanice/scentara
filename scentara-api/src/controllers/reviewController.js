import { ReviewModel } from "../models/reviewModel.js";
import { sendError } from "./respond.js";

export const ReviewController = {
  // GET /api/perfumes/:perfumeId/reviews
  async getByPerfumeId(req, res) {
    try {
      const data = await ReviewModel.getByPerfumeId(req.params.perfumeId);
      res.json(data);
    } catch (err) {
      sendError(res, err);
    }
  },

  // POST /api/perfumes/:perfumeId/reviews
  async create(req, res) {
    try {
      const { author, rating, comment, reviewer_id } = req.body;

      // Validasi sederhana
      if (!author || !author.trim()) {
        return res.status(400).json({ error: "Nama tidak boleh kosong." });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating harus antara 1 sampai 5." });
      }
      if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "Ulasan tidak boleh kosong." });
      }
      if (!reviewer_id) {
        return res.status(400).json({ error: "Reviewer ID diperlukan." });
      }

      const data = await ReviewModel.create({
        perfume_id: req.params.perfumeId,
        author: author.trim(),
        rating,
        comment: comment.trim(),
        reviewer_id,
      });
      res.status(201).json(data);
    } catch (err) {
      sendError(res, err);
    }
  },

  // PUT /api/reviews/:id
  async update(req, res) {
    try {
      const { author, rating, comment } = req.body;

      if (!author || !author.trim()) {
        return res.status(400).json({ error: "Nama tidak boleh kosong." });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating harus antara 1 sampai 5." });
      }
      if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "Ulasan tidak boleh kosong." });
      }

      const data = await ReviewModel.update(req.params.id, {
        author: author.trim(),
        rating,
        comment: comment.trim(),
      });
      res.json(data);
    } catch (err) {
      sendError(res, err);
    }
  },

  // DELETE /api/reviews/:id
  async delete(req, res) {
    try {
      await ReviewModel.delete(req.params.id);
      res.json({ message: "Ulasan berhasil dihapus." });
    } catch (err) {
      sendError(res, err);
    }
  },
};

