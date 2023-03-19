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


export default {
    getClientTotal
}