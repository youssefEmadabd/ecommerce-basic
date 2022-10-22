import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import Product from './Product'
import { IOrder, StatusEnum, IProduct } from '../types';

const productSchema: Schema = new Schema<IProduct>({
    amountAvailable: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    name: { type: String, required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    productId: { type: String, required: false },
    priceId: { type: String, required: false },
})

const OrderSchema: Schema = new Schema<IOrder>({
    products: [productSchema],
    totalCost: { type: Number, required: true },
    status: { type: String, required: true, enum: StatusEnum, default: 'pending' },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    transaction: { type: Object, required: true }
})

OrderSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef Product
 */
export default model<IOrder>('Order', OrderSchema);
