export type CartItem = {
    id: string
    slug: string
    name: string
    price: number
    imageUrl?: string
    quantity: number
}

const KEY = "cart_items_v1"

export function getCart(): CartItem[] {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(KEY)
        const parsed = raw ? JSON.parse(raw) : []
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function setCart(items: CartItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(KEY, JSON.stringify(items))
}

export function isInCart(slug: string) {
    const items = getCart()
    return items.some((x) => x.slug === slug)
}

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1) {
    const items = getCart()
    const idx = items.findIndex((x) => x.slug === item.slug)

    if (idx >= 0) {
        items[idx] = { ...items[idx], quantity: (items[idx].quantity || 1) + qty }
    } else {
        items.push({ ...item, quantity: qty })
    }

    setCart(items)
    return items
}
