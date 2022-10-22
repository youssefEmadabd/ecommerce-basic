import { IProduct } from "../types";
import Service from "./Service";
const stripe = require('stripe')('sk_test_51LvOBzKc9VQizEb05tSnEGEKXbJiTLPSG79fb8zYuSBZGwt5sRxttHToa3CB4oUwEZBZuWV7I7F5StJNJx21Nmai00kcKLb01u');


export default class ProductService extends Service<IProduct> {
    async create(body: object): Promise<IProduct> {
        const newProduct: IProduct = await super.create(body)
        stripe.products.create({
            name: newProduct.name,
            description: newProduct.description,
        }).then(product => {
            stripe.prices.create({
                unit_amount: newProduct.price,
                currency: 'usd',
                product: product.id,
            }
            ).then(price => {
                console.log('Success! Here is your starter subscription product id: ' + product.id);
                console.log('Success! Here is your premium subscription price id: ' + price.id);
                newProduct.productId = product.id
                newProduct.priceId = price.id
                newProduct.save()
            }); 
        });
        return newProduct
    }
}