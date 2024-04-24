import {
  calculateSubTotal,
  calculateTotalPoints,
} from "./calculate.SubTotal.js";

export async function pushNewProduct(cart, product, quantity) {
  cart?.products.push({
    productId: product._id,
    quantity: quantity,
    basePrice: product.appliedPrice,
    cartPoints: product.productPoints * quantity,
    title: product.title,
    finalPrice: product.appliedPrice * quantity,
  });

  cart.subTotal = calculateSubTotal(cart.products);
  cart.totalPoints = calculateTotalPoints(cart.products);

  return await cart.save();
}
