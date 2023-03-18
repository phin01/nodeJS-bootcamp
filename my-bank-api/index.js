import express from "express";
import winston from "winston";
import cors from "cors";
import accountRouter from './routes/accounts.js';
import { promises as fs } from "fs";

global.fileName = 'accounts.json';

const {combine, timestamp, label, printf} = winston.format;

const logFormat = printf(
    ({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message} `;
    }
);

global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'my-bank-api.log' }),
    ],
    format: combine(
        label({ label: 'my-bank-api', }),
        timestamp(),
        logFormat
    )
});

const app = new express();
app.use(express.json());
app.use(cors());

app.use('/account', accountRouter);

app.listen(3000, async () => {

    // check if accounts.json file exists
    // if it doesn't, create it with initial config    
    try {
        await fs.readFile(global.fileName);
        global.logger.info('API started with existing data');
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        fs.writeFile(global.fileName, JSON.stringify(initialJson))
            .then(() => global.logger.info('API started with initial blank data'))
            .catch(err => global.logger.error(err));
    }
});