export function calculateSubTotal(products) {
  let subTotal = 0;
  for (const product of products) {
    subTotal += product.finalPrice;
  }

  return subTotal;
}

export function calculateTotalPoints(products) {
  let points = 0;
  for (const product of products) {
    points += product.cartPoints;
  }

  return points;
}
