import express from "express";
import { promises as fs } from "fs";

const router = express.Router();

// POST request in '/'
// Creates a new account
router.post('/', async (req, res) => {

    let newAccount = req.body;

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile('accounts.json'));
        
        // set new account ID and increment counter for next requests
        newAccount = {id: currentAccounts.nextId, ...newAccount};
        currentAccounts.nextId++;

        // update current list of accounts with new account
        currentAccounts.accounts.push(newAccount);

        // save accounts list to disk (space = 2 for easier visualization during development)
        await fs.writeFile('accounts.json', JSON.stringify(currentAccounts, null, 2));
        
        // return newly created account to user, with its ID
        res.send(newAccount);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }

    res.end();
});

export default router;