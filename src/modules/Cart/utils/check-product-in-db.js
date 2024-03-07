import Product from "../../../../DB/models/product.model.js";

export async function checkProductAvailability(productId) {
  const product = await Product.findById(productId);

  if (!product) return null;
  return product;
}
