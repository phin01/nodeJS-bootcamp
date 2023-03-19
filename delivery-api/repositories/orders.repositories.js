import { promises as fs } from "fs";

async function getOrders() {
    const currentOrders = JSON.parse(await fs.readFile(global.fileName));
    return currentOrders;
}

async function getCompletedOrders() {
    const currentOrders = JSON.parse(await fs.readFile(global.fileName));
    const completedOrders = currentOrders.pedidos.filter(
        (order) => order.entregue === true
    );
    return completedOrders;
}

async function saveOrders(orders) {
    await fs.writeFile(global.fileName, JSON.stringify(orders, null, 2));
}

export default {
    getOrders,
    getCompletedOrders,
    saveOrders
}