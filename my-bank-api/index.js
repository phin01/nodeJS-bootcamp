import express from "express";
import accountRouter from './routes/accounts.js';
import {promises as fs} from "fs";

const app = new express();
app.use(express.json());

app.use('/account', accountRouter);

app.listen(3000, async () => {

    // check if accounts.json file exists
    // if it doesn't, create it with initial config    
    try {
        await fs.readFile('accounts.json');
        console.log('API started with existing data');
    } catch (error) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        fs.writeFile('accounts.json', JSON.stringify(initialJson))
        .then(() => console.log('API started with initial blank data'))
        .catch(err => console.log(err));
    }
});