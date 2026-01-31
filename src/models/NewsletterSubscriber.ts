import mongoose, { Schema, Document, Model } from "mongoose"

export interface INewsletterSubscriber extends Document {
    email: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

const NewsletterSubscriber: Model<INewsletterSubscriber> =
    mongoose.models.NewsletterSubscriber ||
    mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema)

export default NewsletterSubscriber
