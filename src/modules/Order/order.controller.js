import Cart from "../../../DB/models/cart.model.js";
import Order from "../../../DB/models/order.model.js";
import User from "../../../DB/models/user.model.js";
import { APIFeature } from "../../utils/api-features.js";
import { checkProductAvailability } from "../Cart/utils/check-product-in-db.js";
import { getUserCart } from "../Cart/utils/get-user-cart.js";

//==================================== add order ====================================//
/**
 * * destructure data from authUser and body
 * * check product
 * * object for order Items
 * * count price and point for order
 * * order status + paymentMethod
 * * object order
 * * count stock
 * * save order
 * * count stock
 * * add points to user
 * * save changes
 * * response successfully
 */
export const addOrder = async (req, res, next) => {
  // * destructure data from authUser and body
  const { _id: user } = req.authUser;
  const {
    product,
    quantity,
    paymentMethod,
    phoneNumbers,
    address,
    city,
    postalCode,
    country,
  } = req.body;

  // * check product
  const isProductAvailable = await checkProductAvailability(product);
  if (!isProductAvailable) {
    return next(`Product not available`, { cause: 404 });
  }

  // * object for order Items
  const orderItems = [
    {
      title: isProductAvailable.title,
      quantity,
      price: isProductAvailable.appliedPrice,
      product: isProductAvailable._id,
      orderPoints: isProductAvailable.buyByPoints,
    },
  ];

  // * count price and point for order
  let shippingPrice = orderItems[0].price * quantity;
  let totalPrice = shippingPrice;

  let points = orderItems[0].orderPoints * quantity;
  let totalPoints = points;

  // * order status + paymentMethod
  let orderStatue;
  if (paymentMethod === "Cash") {
    orderStatue = "Placed";
  }

  // * object order
  const order = new Order({
    user,
    orderItems,
    shippingAddress: {
      address,
      city,
      postalCode,
      country,
    },
    phoneNumbers,
    shippingPrice,
    totalPrice,
    totalPoints,
    paymentMethod,
    orderStatue,
  });

  // * save order
  await order.save();

  // * count stock
  isProductAvailable.stock -= quantity;
  await isProductAvailable.save();

  // * add points to user
  const userOrder = await User.findById(user);
  if (!userOrder) {
    return next(`user not found`, { cause: 404 });
  }
  userOrder.userPoints += totalPoints;

  // * save changes
  await userOrder.save();

  // * response successfully
  res.status(201).json({
    success: true,
    message: "Order was successfully saved",
    data: order,
    user: userOrder,
  });
};

//==================================== convert cart to order ====================================//
/**
 * * destructure data from authUser and body
 * * cart items
 * * object for order Items
 * * count price and points
 * * order status + paymentMethod
 * * object order
 * * save order
 * * delete cart
 * * add points for user
 * * save changes
 * * response successfully
 */
export const convertCartToOrder = async (req, res, next) => {
  // * destructure data from authUser and body
  const { _id: user } = req.authUser;
  const { paymentMethod, phoneNumbers, address, city, postalCode, country } =
    req.body;

  // * cart items
  const userCart = await getUserCart(user);
  if (!userCart) {
    return next(`cart not found`, { cause: 404 });
  }

  // * object for order Items
  let orderItems = userCart.products.map((cartItem) => {
    return {
      title: cartItem.title,
      price: cartItem.basePrice,
      quantity: cartItem.quantity,
      product: cartItem.productId,
      orderPoints: cartItem.cartPoints,
    };
  });

  // * count price and points
  let shippingPrice = userCart.subTotal;
  let totalPrice = shippingPrice;
  let cartPoints = userCart.totalPoints;
  let totalPoints = cartPoints;

  // * order status + paymentMethod
  let orderStatus;
  if (paymentMethod === "Cash") orderStatus = "Placed";

  // * object order
  const order = new Order({
    user,
    orderItems,
    shippingAddress: { address, city, postalCode, country },
    phoneNumbers,
    shippingPrice,
    totalPrice,
    totalPoints,
    paymentMethod,
    orderStatus,
  });

  // * save order
  await order.save();

  // * delete cart
  await Cart.findByIdAndDelete(userCart._id);

  // * add points for user
  const customer = await User.findById(user);
  if (!customer) {
    return next(`user not found`, { cause: 404 });
  }
  customer.userPoints += totalPoints;

  // * save changes
  await customer.save();

  // * response successfully
  res.status(200).json({
    success: true,
    message: "convert successfully",
    data: order,
    user: customer,
  });
};

//==================================== get all order ====================================//
/**
 * * destructure data from query
 * * get all order
 * * response successfully
 */
export const getAllOrder = async (req, res, next) => {
  //  * destructure data from query
  const { page, size, sort, ...search } = req.query;

  // * get all order
  const features = new APIFeature(req.query, Order.find())
    .pagination({ page, size })
    .sort();

  const orders = await features.mongooseQuery;

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "get all orders", data: orders });
};

//==================================== get order By Id ====================================//
/**
 * * destructure data from query
 * * get order from db
 * * response successfully
 */
export const getOrderById = async (req, res, next) => {
  // * destructure data from query
  const { orderId } = req.query;

  // * get order from db
  const order = await Order.findById(orderId);
  if (!order) {
    return next(`order not found`, { cause: 404 });
  }

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: `Order found successfully`, data: order });
};
