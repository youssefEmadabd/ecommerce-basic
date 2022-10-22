import { Document, ObjectId } from 'mongoose';
import { IProduct } from '../';


export interface IOrder extends Document {
    products: IProduct[];
    totalCost: number;
    status: 'pending' | 'paid' | 'canceled';
    buyerId: ObjectId;
    transaction: object;
}