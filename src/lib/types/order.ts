export type OrderStatus =
    | "pending_verification"
    | "processing"
    | "dispatched"
    | "delivered"
    | "cancelled"
    | "rejected"

export type PaymentReceiver = {
    name: string
    easypaisaMsisdn: string
}

export type OrderItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl: string
    qty: number
}

export type CheckoutForm = {
    firstName: string
    lastName: string
    phone: string
    email: string
    address: string
    city: string
    postal: string
    paymentMethod: "cod" | "online"
}

export type OrderDoc = {
    form: CheckoutForm
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    paymentProofUrl: string
    receiver?: PaymentReceiver
    status: OrderStatus
    createdAt: string
}
