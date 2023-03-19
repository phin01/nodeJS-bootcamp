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


export default {
    clientTotal
}