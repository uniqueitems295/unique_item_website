import mongoose, { Schema, Document, Model, Types } from "mongoose"

export type OrderStatus = "pending" | "processing" | "dispatched" | "delivered" | "cancelled"
export type PaymentMethod = "cod" | "easypaisa" | "jazzcash" | "bank"
export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "rejected"

export interface IOrderItem {
    productId: Types.ObjectId
    name: string
    slug: string
    image: string
    price: number
    quantity: number
}

export interface IPaymentProof {
    method: PaymentMethod
    accountLabel?: string
    accountNumber?: string
    transactionId?: string
    proofImageUrl?: string
    submittedAt?: Date
}

export interface IShippingAddress {
    fullName: string
    phone: string
    email?: string
    addressLine: string
    city: string
    postalCode?: string
    notes?: string
}

export interface IOrder extends Document {
    orderNo: string
    items: IOrderItem[]
    shippingAddress: IShippingAddress
    subtotal: number
    shippingFee: number
    total: number
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    paymentProof?: IPaymentProof
    status: OrderStatus
    createdAt: Date
    updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
)

const ShippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, trim: true, lowercase: true, default: null },
        addressLine: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postalCode: { type: String, trim: true, default: null },
        notes: { type: String, trim: true, default: null },
    },
    { _id: false }
)

const PaymentProofSchema = new Schema<IPaymentProof>(
    {
        method: { type: String, enum: ["cod", "easypaisa", "jazzcash", "bank"], required: true },
        accountLabel: { type: String, trim: true, default: null },
        accountNumber: { type: String, trim: true, default: null },
        transactionId: { type: String, trim: true, default: null },
        proofImageUrl: { type: String, trim: true, default: null },
        submittedAt: { type: Date, default: null },
    },
    { _id: false }
)

const OrderSchema = new Schema<IOrder>(
    {
        orderNo: { type: String, required: true, unique: true, trim: true },
        items: { type: [OrderItemSchema], required: true },
        shippingAddress: { type: ShippingAddressSchema, required: true },

        subtotal: { type: Number, required: true, min: 0 },
        shippingFee: { type: Number, default: 0, min: 0 },
        total: { type: Number, required: true, min: 0 },

        paymentMethod: { type: String, enum: ["cod", "easypaisa", "jazzcash", "bank"], default: "cod" },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "pending_verification", "paid", "rejected"],
            default: "unpaid",
        },
        paymentProof: { type: PaymentProofSchema, default: null },

        status: { type: String, enum: ["pending", "processing", "dispatched", "delivered", "cancelled"], default: "pending" },
    },
    { timestamps: true }
)

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
