import mongoose, { Schema, type InferSchemaType } from "mongoose"

const ContactMessageSchema = new Schema(
    {
        firstName: { type: String, trim: true, required: true },
        lastName: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true },
        whatsapp: { type: String, trim: true, required: true },
        subject: { type: String, trim: true, required: true },
        message: { type: String, trim: true, required: true },
        status: { type: String, enum: ["new", "replied"], default: "new" },
    },
    { timestamps: true }
)

export type ContactMessage = InferSchemaType<typeof ContactMessageSchema>

export default mongoose.models.ContactMessage ||
    mongoose.model("ContactMessage", ContactMessageSchema)
