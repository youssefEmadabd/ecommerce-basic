import { Document, ObjectId } from 'mongoose';
import { IProduct } from '../product/product';
import { IRole } from '../role';

export interface IUser extends Document {
    username: string;
    password: string;
    deposit: number;
    role?: any;
    createdAt?: Date;
    updatedAt?: Date;
    cart: IProduct[] | string[];
}