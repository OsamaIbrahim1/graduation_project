import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addBrandSchema = {
  body: Joi.object({
    name: Joi.string().trim(),
  }),
  query: Joi.object({
    categoryId: generalRules.dbId.required(),
    subCategoryId: generalRules.dbId.required(),
  }),
  headers: generalRules.headersRules.required(),
};

export const deleteBrandSchema = {
  params: Joi.object({
    brandId: generalRules.dbId.required(),
  }),
  headers: generalRules.headersRules.required(),
};

export const updateBrandSchema = {
  body: Joi.object({ name: Joi.string(), oldPublicId: Joi.string() }),
  query: Joi.object({
    brandId: generalRules.dbId,
  }),
  headers: generalRules.headersRules.required(),
};
