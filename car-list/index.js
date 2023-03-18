import express from "express";
import carRouter from './routes/car-router.js';

const app = new express();
app.use(express.json());

app.use('/brands', carRouter);


app.listen(3000, () => console.log('API started'));