import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addToFavoritesSchema = {
  body: Joi.object({
    onModel: Joi.string()
      .valid("Brand", "Product", "Category", "SubCategory")
      .required(),
    favoriteId: generalRules.dbId,
  }),

  headers: generalRules.headersRules,
};

export const getAllFavoritesSchema = {
  headers: generalRules.headersRules,
};
