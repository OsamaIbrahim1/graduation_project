import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    favoriteId: { type: mongoose.Schema.Types.ObjectId, refPath: "onModel" },
    onModel: {
      type: String,
      enum: ["Brand", "Product", "Category", "SubCategory"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Favorite ||
  mongoose.model("Favorite", favoriteSchema);
