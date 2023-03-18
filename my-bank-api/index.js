import express from "express";
import accountRouter from './routes/accounts.js';

const app = new express();
app.use(express.json());

app.use('/account', accountRouter);

app.listen(3000, () => {
    console.log('API started');
});