import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as subCategoryController from "./sub-category.controller.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";
import { allowedExtensions } from "../../utils/allowedExtentions.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as subCategoryValidation from "./sub-category.validation-schema.js";
import { systemRoles } from "../../utils/system-role.js";

const router = Router();

router.post(
  "/addSubCategory/:categoryId",
  auth(systemRoles.ADMIN),
  validationMiddleware(subCategoryValidation.addSubCategorySchema),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(subCategoryController.addSubCategory)
);

router.put(
  "/updateSubCategory",
  auth(systemRoles.ADMIN),
  validationMiddleware(subCategoryValidation.updateSubCategorySchema),
  multerMiddleHost({ extensions: allowedExtensions.images }).single("image"),
  expressAsyncHandler(subCategoryController.updateSubCategory)
);

router.delete(
  "/deleteSubCategory",
  auth(systemRoles.ADMIN),
  validationMiddleware(subCategoryValidation.deleteSubCategorySchema),
  expressAsyncHandler(subCategoryController.deleteSubCategory)
);

router.get(
  "/getAllSubcategoriesWithBrands",
  expressAsyncHandler(subCategoryController.getAllSubcategoriesWithBrands)
);

export default router;
