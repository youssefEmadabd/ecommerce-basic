import { OrderService } from "../services";
import { IOrder, IProduct, IUser, Documents } from "../types";
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
    async getAll(req: IReq, res: IRes) {
        const filter = req.query.status ? { status: req.query.status } : {}
        const orders: Documents<IOrder> = await this.service.getAllWithPagination(
            filter,
            { limit: req.query.limit, page: req.query.page })
        res.status(httpStatus.ACCEPTED).send(orders)
    }

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
            res.send("Canceled transaction")
            return
        }
        if (success) {
            res.send("successful transaction")
            return
        }
        res.send("no content")
    }
    async placeOrder(req: IReq, res: IRes): Promise<void> {

        if (req.user.role !== 'buyer')
            throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to perform this action');

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

        const session = await createCheckoutSession(orderList, req.user.sub)
        res.send(session.url);
    }

    async callback(req: IReq, res: IRes, next: INext): Promise<void> {
        const { metadata, payment_status, amount_total } = req.body.data.object
        console.log("🚀 ~ file: OrderController.ts ~ line 89 ~ OrderController ~ callback ~ metadata", metadata)

        const user: IUser = await userService.get({ _id: metadata.userId }, { populate: 'cart' })
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found")

        await this.service.create({
            products: user.cart,
            totalCost: amount_total / 100,
            status: payment_status === 'paid' ? 'paid' : 'canceled',
            buyerId: user.id,
            transaction: req.body,
        })

        await userService.update({ _id: user.id }, { cart: [] })
        res.status(204).send()
    }
}
export default new OrderController(orderService);