import { promises as fs } from "fs";

async function createAccount(req, res, next) {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));

        // get new account data and validate fields
        let newAccount = req.body;
        if(!newAccount.name || newAccount.balance == null) {
            throw new Error("Account must have name and balance");
        }
        
        // set new account ID and increment counter for next requests
        // create object only with required fields, to avoid additional info from body
        newAccount = { id: currentAccounts.nextId, name: newAccount.name, balance: newAccount.balance };
        currentAccounts.nextId++;

        // update current list of accounts with new account
        currentAccounts.accounts.push(newAccount);

        // save accounts list to disk (space = 2 for easier visualization during development)
        await fs.writeFile(global.fileName, JSON.stringify(currentAccounts, null, 2));

        // return newly created account to user, with its ID
        res.send(newAccount);
        global.logger.info(`POST /account - Account ${newAccount.id} created`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function getAccounts(req, res, next) {
    
    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));

        // remove 'nextId' field before returning to the user
        delete currentAccounts.nextId;
        res.send(currentAccounts);
        global.logger.info(`GET /account`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function getAccount(req, res, next) {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));

        // get specific account from list of accounts
        const requestedAccount = currentAccounts.accounts.find(
            (requestedAccount) => requestedAccount.id === parseInt(req.params.id)
        );
        if (!requestedAccount) {
            res.status(404).send({ error: 'Account not found' });
        }
        res.send(requestedAccount);
        global.logger.info(`GET /account/${req.params.id}`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function deleteAccount(req, res, next) {
    
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
        global.logger.info(`DELETE /account/${req.params.id}`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function updateBalance (req, res, next) {

    try {
        // get current list of accounts
        const currentAccounts = JSON.parse(await fs.readFile(global.fileName));

        // account to be updated
        const updatedAccount = req.body;
        
        // check if required fields are available
        if(!updatedAccount.id || updatedAccount.balance == null) {
            throw new Error("Request must have account ID and balance");
        }

        // check if balance is numeric
        if(isNaN(updatedAccount.balance)) {
            throw new Error("Balance must be numeric");
        }

        // find account's index in account list
        const accountIndex = currentAccounts.accounts.findIndex(
            (acc) => acc.id === updatedAccount.id
        );

        // update account in account list
        currentAccounts.accounts[accountIndex].balance = parseFloat(updatedAccount.balance);

        // save updated accounts list to disk
        await fs.writeFile(global.fileName, JSON.stringify(currentAccounts, null, 2));

        // return updated account to user
        res.send(currentAccounts.accounts[accountIndex]);
        global.logger.info(`PATCH /updateBalance - Account ${updatedAccount.id}`);

    } catch (error) {
        next(error);
    }

    res.end();
}


export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateBalance
};