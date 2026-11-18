import { BrandModel } from "../models/brandModel.js";
import { sendError } from "./respond.js";

export const BrandController = {
  async getAll(req, res) {
    try {
      res.json(await BrandModel.getAll());
    } catch (err) {
      sendError(res, err);
    }
  },
};
