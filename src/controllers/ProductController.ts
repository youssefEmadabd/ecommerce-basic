import Controller from './Controller';
import { Product, User } from '../models';
import { ProductService, UserService } from '../services';
import { IProduct, IUser } from '../types';
import {
    RequestInterface as IReq,
} from '../types';
import { Response as IRes, NextFunction as INext } from 'express';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const userService = new UserService(User)
const productService = new ProductService(Product);

class ProductController extends Controller<IProduct, ProductService> {
    async create(req: IReq, res: IRes) {
        console.log("🚀 ~ file: ProductsController.ts ~ line 16 ~ ProductsController ~ create ~ req.user.role", req.user.role)
        if (req.user.role !== 'admin' && req.user.role !== 'seller')
            throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');
        const { body } = req;
        const product: IProduct = await productService.create({ ...body, sellerId: req.user.sub });
        if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        res.status(httpStatus.CREATED).json(product);
    }
    async update(req: IReq, res: IRes) {
        if (req.user.role !== 'admin' && req.user.role !== 'seller')
            throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');
        const { body } = req;
        const product: IProduct = await productService.update({ _id: body.productId }, body);
        if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        res.status(httpStatus.CREATED).json(product);
    }

    async delete(req: IReq, res: IRes) {
        if (req.user.role !== 'admin' && req.user.role !== 'seller')
            throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');
        const product: IProduct = await productService.delete({ _id: req.body.productId });
        if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        res.status(httpStatus.NO_CONTENT).send();
    }

    async addToCart(req: IReq, res: IRes) {
        if (req.user.role !== 'buyer')
            throw new ApiError(httpStatus.BAD_REQUEST, 'Only customers can add to cart');
        const { id } = req.params
        const product: IProduct = await this.service.get({ _id: id })
        if (!Product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found")
        if (product.amountAvailable <= 0) throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Out of stock")

        const user: IUser = await userService.update({ _id: req.user.sub }, { $push: { cart: product } })
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found")

        await this.service.update({ _id: product.id }, { amountAvailable: product.amountAvailable - 1 })

        res.status(httpStatus.ACCEPTED).send(user)
    }
}

export default new ProductController(productService);
