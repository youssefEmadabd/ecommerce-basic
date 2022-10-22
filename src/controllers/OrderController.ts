import { OrderService } from "../services";
import { IOrder, IProduct, IUser } from "../types";
import { Order, Product, User } from "../models"
import Controller from "./Controller";
import httpStatus from 'http-status';
import {
    RequestInterface as IReq,
} from '../types';
import ApiError from "../utils/ApiError";
import { Response as IRes, NextFunction as INext } from 'express';
import { UserService, ProductService, createCheckoutSession } from '../services'

const orderService = new OrderService(Order);
const userService = new UserService(User);
const productService = new ProductService(Product);

class OrderController extends Controller<IOrder, OrderService> {
    async create(req: IReq, res: IRes) {
        if (req.user.role !== 'admin') {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Only Admins can create orders from this api")
        }
        super.create(req, res)
    }

    async update(req: IReq, res: IRes) {
        if (req.user.role !== 'admin') {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Only Admins can update orders from this api")
        }
        super.update(req, res)
    }

    async delete(req: IReq, res: IRes) {
        if (req.user.role !== 'admin') {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Only Admins can delete orders from this api")
        }
        super.delete(req, res)
    }


    async handleResponse(req: IReq, res: IRes, next: INext) {
        const success: String = req.query.success
        const canceled: String = req.query.canceled

        if (canceled) {
            console.log("🚀 ~ file: OrderController.ts ~ line 16 ~ OrderController ~ handleResponse ~ canceled", canceled)
        }
        if (success) {
            console.log("🚀 ~ file: OrderController.ts ~ line 14 ~ OrderController ~ handleResponse ~ success", success)
        }
        res.status(httpStatus.OK).send()
    }
    async placeOrder(req: IReq, res: IRes): Promise<void> {

        if (req.user.role !== 'buyer')
            throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');
        const { productId } = req.params;

        const user: IUser = await userService.get({ _id: req?.user?.sub }, { populate: 'cart' });
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        let orderList: [{ price: string, quantity: number }]

        for (const product of user.cart) {
            const productObject = product as IProduct
            if (!orderList) {
                orderList = [{ price: productObject.priceId, quantity: 1 }]
            }
            else {
                let index = orderList.findIndex((value) => value.price === productObject.priceId)
                if (index !== -1) {
                    orderList[index].quantity++;
                }
                else {
                    orderList.push({ price: productObject.priceId, quantity: 1 })
                }
            }
        }

        console.log(orderList)

        const session = await createCheckoutSession(orderList)
        res.redirect(303, session.url);
    }
}
export default new OrderController(orderService);