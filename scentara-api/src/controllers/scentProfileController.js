import { ScentProfileModel } from "../models/scentProfileModel.js";
import { sendError } from "./respond.js";

export const ScentProfileController = {
  async getAll(req, res) {
    try {
      res.json(await ScentProfileModel.getAll());
    } catch (err) {
      sendError(res, err);
    }
  },
};
