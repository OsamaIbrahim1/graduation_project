import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const addOrderSchema = {
  body: Joi.object({
    product: generalRules.dbId,
    quantity: Joi.number().required(),
    paymentMethod: Joi.string().required().valid("Cash", "Stripe", "Paymob"),
    phoneNumbers: Joi.array().items(Joi.string().required()),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  headers: generalRules.headersRules,
};

export const convertCartToOrderSchema = {
  body: Joi.object({
    paymentMethod: Joi.string().required().valid("Cash", "Stripe", "Paymob"),
    phoneNumbers: Joi.array().items(Joi.string().required()),
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  headers: generalRules.headersRules,
};
export const getOrderByIdSchema = {
  body: Joi.object({
    orderId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};
