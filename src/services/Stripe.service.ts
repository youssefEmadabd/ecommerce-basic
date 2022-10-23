import { config } from '../config/config';
import Stripe from 'stripe';
const stripe = new Stripe(config.stripe.apiSecret, { apiVersion: "2022-08-01" })

const createCheckoutSession = async (orderList: [{ price: string, quantity: number }]): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
    const session: Stripe.Response<Stripe.Checkout.Session> = await stripe.checkout.sessions.create({
        line_items: orderList,
        mode: 'payment',
        success_url: `${config.domain}/v1/orders/response?success=true`,
        cancel_url: `${config.domain}/v1/orders/response?canceled=true`,
    });
    return session
}

export default createCheckoutSession