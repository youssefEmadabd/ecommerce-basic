import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { IProduct } from '../types';

const productSchema: Schema = new Schema<IProduct>({
    amountAvailable: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    name: { type: String, required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    productId: { type: String, required: false },
    priceId: { type: String, required: false },
})

productSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef Product
 */
export default model<IProduct>('Product', productSchema);
