import { Schema, model } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import fixtures from 'node-mongoose-fixtures';

import { IRole, RolesEnum } from '../types';

const roleSchema: Schema = new Schema<IRole>({
    role: { type: String, required: true, enum: RolesEnum, },
});

roleSchema.plugin(mongooseLeanVirtuals);

/**
 * @typedef Role
 */
const rolesModel = model<IRole>('Role', roleSchema);

fixtures({
    Role: [
        { role: 'buyer' },
        { role: 'seller' },
        { role: 'admin' }
    ],
}, function (err, data) {
    // data is an array of all the documents created
});
export default rolesModel;