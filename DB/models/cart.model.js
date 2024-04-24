import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, default: 1 },
        basePrice: {
          type: Number,
          required: true,
          default: 0,
        },
        cartPoints: { type: Number, required: true, default: 0 },
        finalPrice: { type: Number, required: true },
        title: { type: String, required: true },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timeseries: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
