import express from "express";
import { promises as fs } from "fs";

const router = express.Router();

// POST request in '/'
// Creates a new account
router.post('/', async (req, res) => {

    let newAccount = req.body;

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
        
        // set new account ID and increment counter for next requests
        newAccount = {id: currentAccounts.nextId, ...newAccount};
        currentAccounts.nextId++;

        // update current list of accounts with new account
        currentAccounts.accounts.push(newAccount);

        // save accounts list to disk (space = 2 for easier visualization during development)
        await fs.writeFile(global.fileName, JSON.stringify(currentAccounts, null, 2));
        
        // return newly created account to user, with its ID
        res.send(newAccount);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }

    res.end();
});


// GET request in '/'
// Returns all accounts
router.get('/', async (req, res) => {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
        
        // remove 'nextId' field before returning to the user
        delete currentAccounts.nextId;
        res.send(currentAccounts);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }

    res.end();
});

export default router;