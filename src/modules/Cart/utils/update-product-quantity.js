import Cart from "../../../../DB/models/cart.model.js";
import { calculateSubTotal } from "./calculate.SubTotal.js";
import { checkProductIfExistsInCart } from "./check-product-in-cart.js";

export async function updateProductQuantity(cart, productId, quantity) {
  const isProductExistInCart = await checkProductIfExistsInCart(
    cart,
    productId
  );
  if (!isProductExistInCart) return null;
  cart?.products.forEach((product) => {
    if (product.productId.toString() === productId) {
      product.quantity = quantity;
      product.finalPrice = product.basePrice * quantity;
    }
  });

  cart.subTotal = calculateSubTotal(cart.products);
  return cart.save();
}
