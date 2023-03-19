import OrderService from '../services/orders.services.js';

async function clientTotal(req, res, next) {

    try {
        const client = req.body.client;
        if(!client) {
            throw new Error("Must provide a client");
        }

        const total = await OrderService.getClientTotal(client);
        res.send({
            "client": client,
            "total": total
        });
        
    } catch (error) {
        next(error);
    }
}


async function productTotal(req, res, next) {

    try {
        const product = req.body.product;
        if(!product) {
            throw new Error("Must provide a product");
        }

        const total = await OrderService.getProductTotal(product);
        res.send({
            "product": product,
            "total": total
        });
        
    } catch (error) {
        next(error);
    }
}


export default {
    clientTotal,
    productTotal
}