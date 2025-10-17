import mongoose, { Document, Schema } from "mongoose";

export interface IDiscount extends Document {
  _id: mongoose.Types.ObjectId;
  type: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
  ruleType: string;
  productId?: mongoose.Types.ObjectId;
  category?: string;
  discountValue: number;
  minQuantity?: number;
  payForQuantity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const discountSchema = new Schema<IDiscount>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      immutable: true,
    },
    type: {
      type: String,
      enum: ["BOGO", "BUY_X_FOR_Y", "PERCENTAGE_OFF"],
      required: true,
    },
    ruleType: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    category: {
      type: String,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minQuantity: {
      type: Number,
      default: 1,
    },
    payForQuantity: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IDiscount>("Discount", discountSchema);
