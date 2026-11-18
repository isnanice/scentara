import { PerfumeModel } from "../models/perfumeModel.js";
import { sendError } from "./respond.js";

export const PerfumeController = {
  async getAll(req, res) {
    try {
      const { brand, scent, search } = req.query;
      res.json(await PerfumeModel.getAll({ brand, scent, search }));
    } catch (err) {
      sendError(res, err);
    }
  },

  async getById(req, res) {
    try {
      res.json(await PerfumeModel.getById(req.params.id));
    } catch (err) {
      sendError(res, err);
    }
  },
};
