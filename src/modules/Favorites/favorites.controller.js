import { response } from "express";
import Favorite from "../../../DB/models/favorites.model.js";
import Product from "../../../DB/models/product.model.js";
import Brand from "../../../DB/models/brand.model.js";
import Category from "../../../DB/models/category.model.js";
import SubCategory from "../../../DB/models/sub-category.model.js";

//================================= add to favorites =================================//
/**
 * * destructure data from authUser and body
 * * check type onModel and if modelId is already exists
 * * check if the model in favorite delete it
 * * create object favorite
 * * create new document
 * * response successfully
 */
export const addToFavorites = async (req, res, next) => {
  // * destructure data from authUser and body
  const { _id: userId } = req.authUser;
  const { onModel, favoriteId } = req.body;

  // * check type onModel and if modelId is already exists
  if (onModel === "Product") {
    const checkModelId = await Product.findById(favoriteId);
    if (!checkModelId) {
      return next({ message: `this Product Not found`, cause: 404 });
    }
  } else if (onModel === "Brand") {
    const checkModelId = await Brand.findById(favoriteId);
    if (!checkModelId) {
      return next({ message: `this Brand Not found`, cause: 404 });
    }
  } else if (onModel === "Category") {
    const checkModelId = await Category.findById(favoriteId);
    if (!checkModelId) {
      return next({ message: `this Category Not found`, cause: 404 });
    }
  } else if (onModel === "SubCategory") {
    const checkModelId = await SubCategory.findById(favoriteId);
    if (!checkModelId) {
      return next({ message: `this SubCategory Not found`, cause: 404 });
    }
  }

  // * check if the model in favorite delete it
  const checkModel = await Favorite.findOne({ favoriteId, userId });
  if (checkModel) {
    await Favorite.findByIdAndDelete(checkModel._id);
    return next({ message: "deleted from Favorites", cause: 404 });
  }

  // * create object favorite
  const favoriteObj = {
    userId,
    favoriteId,
    onModel,
  };

  // * create new document
  const addModelToFavorite = await Favorite.create(favoriteObj);
  if (!addModelToFavorite) {
    return next({ message: "Not added to Favorites", cause: 400 });
  }

  // * response successfully
  res.status(201).json({
    success: true,
    message: "added to favorites successfully",
    data: addModelToFavorite,
  });
};

//================================= get all favorites for user =================================//
/**
 * * destructure data from authUser
 * * get all favorites for user
 * * response successfully
 */
export const getAllFavorites = async (req, res, next) => {
  // * destructure data from authUser
  const { _id: userId } = req.authUser;

  // * get all favorites for user
  const favorites = await Favorite.find({ userId });
  if (!favorites.length) {
    return next({ message: "this user has not favorites", cause: 404 });
  }

  // * response successfully
  res.status(200).json({
    success: true,
    message: "get all favorites for user successfully",
    data: favorites,
  });
};
