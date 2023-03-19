import OrdersRepository from '../repositories/orders.repositories.js';

async function getClientTotal(client) {

    const completedOrders = await OrdersRepository.getCompletedOrders();
    let total = 0;

    const clientOrders = completedOrders
        .filter((orderClient) => orderClient.cliente === client);

    clientOrders.forEach(element => { total += element.valor 
    });

    return total;
}


async function getProductTotal(product) {

    const completedOrders = await OrdersRepository.getCompletedOrders();
    let total = 0;

    const productOrders = completedOrders
        .filter((orderProduct) => orderProduct.produto === product);

    productOrders.forEach(element => { total += element.valor 
    });

    return total;
}


async function getTopProducts() {

    const completedOrders = await OrdersRepository.getCompletedOrders();

    let countProducts = {};

    for (const order of completedOrders) {
        countProducts[order.produto] = (countProducts[order.produto] || 0) + 1
    }

    countProducts = Object.entries(countProducts);
    countProducts.sort(
        (a, b) => b[1] - a[1]
    );

    return countProducts;
}


export default {
    getClientTotal,
    getProductTotal,
    getTopProducts
}