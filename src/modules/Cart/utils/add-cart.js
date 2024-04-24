import Cart from "../../../../DB/models/cart.model.js";

export async function addCart(userId, product, quantity) {
  const cartObj = {
    userId,
    products: [
      {
        productId: product._id,
        quantity,
        basePrice: product.appliedPrice,
        cartPoints: product.productPoints * quantity,
        title: product.title,
        finalPrice: product.appliedPrice * quantity,
      },
    ],
    totalPoints: product.productPoints * quantity,
    subTotal: product.appliedPrice * quantity,
  };
  const newCart = await Cart.create(cartObj);

  return newCart;
}
