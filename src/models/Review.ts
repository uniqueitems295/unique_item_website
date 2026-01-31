import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IReview extends Document {
    productId: Types.ObjectId
    name: string
    rating: 1 | 2 | 3 | 4 | 5
    comment: string
    isApproved: boolean
    createdAt: Date
    updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
        isApproved: { type: Boolean, default: true },
    },
    { timestamps: true }
)

const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)

export default Review
