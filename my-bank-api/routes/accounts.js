import express from "express";
import { promises as fs } from "fs";

const router = express.Router();

// POST request in '/'
// Creates a new account
router.post('/', async (req, res, next) => {

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
        next(error);
    }

    res.end();
});


// GET request in '/'
// Returns all accounts
router.get('/', async (req, res, next) => {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
        
        // remove 'nextId' field before returning to the user
        delete currentAccounts.nextId;
        res.send(currentAccounts);

    } catch (error) {
        next(error);
    }

    res.end();
});


// GET request in '/:id'
// Returns specific accounts
router.get('/:id', async (req, res, next) => {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
        
        // get specific account from list of accounts
        const requestedAccount = currentAccounts.accounts.find(
            (requestedAccount) => requestedAccount.id === parseInt(req.params.id)
            );
        if(!requestedAccount) {
            res.status(404).send({ error: 'Account not found' });
        }
        res.send(requestedAccount);

    } catch (error) {
        next(error);
    }

    res.end();
});


// DELETE request in '/:id'
// Delete specific account
router.delete('/:id', async (req, res, next) => {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
        
        // filter accounts list excluding the deleted ID
        currentAccounts.accounts = currentAccounts.accounts.filter(
            (account) => account.id !== parseInt(req.params.id)
        );

        // save updated accounts list to disk
        await fs.writeFile(global.fileName, JSON.stringify(currentAccounts, null, 2));
        
        res.end();

    } catch (error) {
        next(error);
    }

    res.end();
});


// PATCH request in '/updateBalance'
// Update account's balance based on request body (id, balance)
router.patch('/updateBalance', async (req, res, next) => {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));

        // account to be updated
        const updatedAccount = req.body;

        // find account's index in account list
        const accountIndex = currentAccounts.accounts.findIndex(
            (acc) => acc.id === updatedAccount.id
        );

        // update account in account list
        currentAccounts.accounts[accountIndex].balance = updatedAccount.balance;
        
        // save updated accounts list to disk
        await fs.writeFile(global.fileName, JSON.stringify(currentAccounts, null, 2));
        
        // return updated account to user
        res.send(currentAccounts.accounts[accountIndex]);

    } catch (error) {
        next(error);
    }

    res.end();
});


// Generic error handling for all routes
router.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
});


export default router;