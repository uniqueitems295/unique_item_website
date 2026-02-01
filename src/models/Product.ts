import mongoose, { Schema, Model, models } from "mongoose";

export interface IProduct {
    name: string;
    slug: string;
    price: number;
    oldPrice?: number | null;
    category: string;
    collection: string;
    description?: string;
    images?: string[];
    colors?: string[];
    inStock: boolean;
    isPublished: boolean;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        oldPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        category: {
            type: String,
            required: true,
        },

        collection: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        images: {
            type: [String],
            default: [],
        },

        colors: {
            type: [String],
            default: [],
        },

        inStock: {
            type: Boolean,
            default: true,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product: Model<IProduct> =
    models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
