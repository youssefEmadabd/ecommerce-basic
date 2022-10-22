import { Document, ObjectId } from 'mongoose';

export interface IProduct extends Document {
    amountAvailable?: number,
    price: number,
    name: string,
    sellerId: ObjectId,
    description: string,
    productId: string,
    priceId: string
}