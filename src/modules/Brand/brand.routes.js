import { Router } from "express";

import * as brandController from "./brand.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtentions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as validators from "./brand.validation-schema.js";
import expressAsyncHandler from "express-async-handler";
import { systemRoles } from "../../utils/system-role.js";

const router = Router();

router.post(
  "/addBrand",
  auth([systemRoles.ADMIN]),
  validationMiddleware(validators.addBrandSchema),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(brandController.addBrand)
);

router.delete(
  "/deleteBrand/:brandId",
  auth([systemRoles.ADMIN]),
  validationMiddleware(validators.deleteBrandSchema),
  expressAsyncHandler(brandController.deleteBrand)
);

router.put(
  "/updateBrand",
  auth([systemRoles.ADMIN]),
  validationMiddleware(validators.updateBrandSchema),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(brandController.updateBrand)
);

router.get("/getBrands", expressAsyncHandler(brandController.getBrands));

export default router;
