import Cart from "../../../../DB/models/cart.model.js";

/**
 *
 * @param {String} userId
 * @returns {userCart|null}
 * @description get the user's cart
 */
export async function getUserCart(userId) {
  const userCart = await Cart.findOne({ userId });

  return userCart;
}
