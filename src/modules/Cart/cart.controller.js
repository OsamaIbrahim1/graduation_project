import Cart from "../../../DB/models/cart.model.js";
import Product from "../../../DB/models/product.model.js";
import { addCart } from "./utils/add-cart.js";
import { pushNewProduct } from "./utils/add-product-to-cart.js";
import { calculateSubTotal } from "./utils/calculate.SubTotal.js";
import { checkProductAvailability } from "./utils/check-product-in-db.js";
import { getUserCart } from "./utils/get-user-cart.js";
import { updateProductQuantity } from "./utils/update-product-quantity.js";

//================================= add Product To Cart =================================//
/**
 * * destructure data from body and authUser
 * * check product
 * * check if the user has a cart
 * * check if the user has no cart, create a new cart and add the product to it
 * * returns The cart state after modifying its products array to reflect the updated quantities and subtotals.
 * * check if the returned value is null, then the product is not found in the cart and we will add it.
 * * response successfully
 */
export const addProductToCart = async (req, res, next) => {
  // * destructure data from body and authUser
  const { productId, quantity } = req.body;
  const { _id } = req.authUser;

  // * check product
  const product = await checkProductAvailability(productId);
  if (!product) {
    return next({ message: "Product not found or not available", cause: 404 });
  }

  // * check if the user has a cart
  const userCart = await getUserCart(_id);

  // * check if the user has no cart, create a new cart and add the product to it
  if (!userCart) {
    const newCart = await addCart(_id, product, quantity);

    return res.status(201).json({
      success: true,
      message: "cart added successfully",
      data: newCart,
    });
  }

  // * returns The cart state after modifying its products array to reflect the updated quantities and subtotals.
  // * check if the returned value is null, then the product is not found in the cart and we will add it.
  const isUpdated = await updateProductQuantity(userCart, productId, quantity);
  if (!isUpdated) {
    const added = await pushNewProduct(userCart, product, quantity);
    if (!added) {
      return next({ message: "Product not added to cart", cause: 400 });
    }
  }

  // * response successfully
  res.status(201).json({
    success: true,
    message: "product added to cart successfully",
    data: userCart,
  });
};

//============================= Remove product From Cart ===============================//
/**
 * * destructure data from authUser and query
 * * check Cart
 * * remove product from cart
 * * save changes
 * * check if cart is empty
 * * response successfully
 */
export const removeProductFromCart = async (req, res, next) => {
  // * destructure data from authUser and query
  const { productId } = req.params;
  const { _id } = req.authUser;

  // * check Cart
  const userCart = await Cart.findOne({
    userId: _id,
    "products.productId": productId,
  });
  if (!userCart) {
    return next({ message: "Cart not found", cause: 404 });
  }

  // * remove product from cart
  userCart.products = userCart.products.filter(
    (product) => product.productId.toString() !== productId
  );

  userCart.subTotal = calculateSubTotal(userCart.products);

  // * save changes
  const newCart = await userCart.save();

  // * check if cart is empty
  if (newCart.products.length === 0) {
    await Cart.findByIdAndDelete(newCart._id);
  }

  // * response successfully
  res.status(200).json({
    success: true,
    message: "product deleted from cart successfully",
    data: newCart,
  });
};
