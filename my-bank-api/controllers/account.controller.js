import AccountService from '../services/account.services.js';

async function createAccount(req, res, next) {

    try {
        // get new account data and validate fields
        const newAccount = req.body;
        if(!newAccount.name || newAccount.balance == null) {
            throw new Error("Account must have name and balance");
        }

        // check if balance is numeric
        if(isNaN(newAccount.balance)) {
            throw new Error("Balance must be numeric");
        }

        // call service to create account
        const createdAccount = await AccountService.createAccount(newAccount);

        // return newly created account to user, with its ID
        res.send(createdAccount);
        global.logger.info(`POST /account - Account ${newAccount.id} created`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function getAccounts(req, res, next) {
    
    try {
        // call service to get list of accounts
        const currentAccounts = await AccountService.getAccounts();
        
        // return the list to the users
        res.send(currentAccounts);
        global.logger.info(`GET /account`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function getAccount(req, res, next) {

    try {
        // call service to get specific account
        const requestedAccount = await AccountService.getAccount(parseInt(req.params.id));

        // if account is not found, return 404 error
        // otherwise, return account to user
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
        // call service to delete specific account
        const deleted = await AccountService.deleteAccount(parseInt(req.params.id));

        // if account could not be found/deleted, return 404
        // otherwise, end successfully
        if (!deleted) {
            res.status(404).send({ error: 'Account not found' });
        }

        res.end();
        global.logger.info(`DELETE /account/${req.params.id}`);

    } catch (error) {
        next(error);
    }

    res.end();
}


async function updateBalance (req, res, next) {

    try {
        // account to be updated
        const account = req.body;
        
        // check if required fields are available
        if(!account.id || account.balance == null) {
            throw new Error("Request must have account ID and balance");
        }

        // check if balance is numeric
        if(isNaN(account.balance)) {
            throw new Error("Balance must be numeric");
        }

        // call service to update account balance
        const updatedAccount = await AccountService.updateBalance(parseInt(account.id), parseFloat(account.balance));
        if (!updatedAccount) {
            res.status(404).send({ error: 'Account not found' });
        }
        
        // return updated account to user
        res.send(updatedAccount);
        global.logger.info(`PATCH /updateBalance - Account ${account.id}`);

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