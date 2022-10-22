import { Document } from 'mongoose';

export interface IRole extends Document {
    role: 'buyer' | 'seller' | 'admin';
}