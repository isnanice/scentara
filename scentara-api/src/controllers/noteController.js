import { NoteModel } from "../models/noteModel.js";
import { sendError } from "./respond.js";

export const NoteController = {
  async getAll(req, res) {
    try {
      const { category, search } = req.query;
      res.json(await NoteModel.getAll({ category, search }));
    } catch (err) {
      sendError(res, err);
    }
  },

  async getCategories(req, res) {
    try {
      res.json(await NoteModel.getCategories());
    } catch (err) {
      sendError(res, err);
    }
  },

  async getById(req, res) {
    try {
      res.json(await NoteModel.getById(req.params.id));
    } catch (err) {
      sendError(res, err);
    }
  },
};
