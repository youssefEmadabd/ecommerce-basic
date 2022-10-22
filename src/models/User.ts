import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { Schema, model } from 'mongoose';

import { IUser } from '../types';

const userSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true, index: true, unique: true },
    deposit: { type: Number, required: true, default: 0 },
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
})

userSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef User
 */
export default model<IUser>('User', userSchema);
