import express from "express";
import winston from "winston";
import ordersRouter from './routes/orders.routes.js';

global.fileName = 'pedidos.json';

const {combine, timestamp, label, printf} = winston.format;

const logFormat = printf(
    ({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message} `;
    }
);

global.logger = winston.createLogger({
    level: 'info',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'deliveries-api.log' }),
    ],
    format: combine(
        label({ label: 'deliveries-api', }),
        timestamp(),
        logFormat
    )
});

const app = new express();
app.use(express.json());

app.use('/orders', ordersRouter);

app.listen(3000, async () => {

    // check if orders.json file exists
    try {
        await fs.readFile(global.fileName);
        global.logger.info('API started with existing data');
    } catch (error) {
        global.logger.error('Could not load order data');
    }
});