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

export default {
    createAccount
};