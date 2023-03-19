import express from "express";
import OrdersController from '../controllers/orders.controller.js';

const router = express.Router();

/*router.post('/', OrdersController.createOrder);
router.get('/', OrdersController.getOrders);
router.get('/:id', OrdersController.getOrder);
router.delete('/:id', OrdersController.deleteOrder);*/

router.get('/clientTotal', OrdersController.clientTotal);
/*router.get('/productTotal/:product', OrdersController.productTotal);
router.get('/topProducts', OrdersController.topProducts);*/


// Generic error handling for all routes
router.use((err, req, res, next) => {
    global.logger.error(` ${req.method} /orders${req.url}  ${err.message}`);
    res.status(400).send({ error: err.message });
});


export default router;