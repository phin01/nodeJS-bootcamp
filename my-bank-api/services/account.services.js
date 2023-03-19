import AccountRepository from '../repositories/account.repositories.js';

async function createAccount(account) {
    // get current list of accounts
    const currentAccounts = await AccountRepository.getAccounts();

    // set new account ID and increment counter for next requests
    // create object only with required fields, to avoid additional info from body
    const newAccount = { id: currentAccounts.nextId, name: account.name, balance: account.balance };
    currentAccounts.nextId++;

    // update current list of accounts with new account
    currentAccounts.accounts.push(newAccount);

    // save accounts list to disk
    await AccountRepository.saveAccounts(currentAccounts);

    // return created account
    return newAccount;
}


async function getAccounts() {
    // get current list of accounts
    const currentAccounts = await AccountRepository.getAccounts();

    // remove 'nextId' field before returning to the user
    delete currentAccounts.nextId;

    return currentAccounts;
}


async function getAccount(id) {
    // get current list of accounts
    const currentAccounts = AccountRepository.getAccounts();

    // get specific account from list of accounts
    const requestedAccount = currentAccounts.accounts.find(
        (requestedAccount) => requestedAccount.id === id
    );

    return requestedAccount;
}


async function deleteAccount(id) {
    // get current list of accounts
    const currentAccounts = await AccountRepository.getAccounts();

    // if account doesn't exist, return false
    const requestedAccount = currentAccounts.accounts.find(
        (requestedAccount) => requestedAccount.id === id
    );
    if(!requestedAccount) return false;

    // filter accounts list excluding the deleted ID
    currentAccounts.accounts = currentAccounts.accounts.filter(
        (account) => account.id !== id
    );

    // save updated accounts list to disk
    await AccountRepository.saveAccounts(currentAccounts);
    
    return true;
}


async function updateBalance(id, balance) {
    // get current list of accounts
    const currentAccounts = await AccountRepository.getAccounts();

    // find account's index in account list. return false if cannot be found
    const accountIndex = currentAccounts.accounts.findIndex(
        (acc) => acc.id === id
    );
    if(accountIndex === -1) return false;

    // update account in account list
    currentAccounts.accounts[accountIndex].balance = balance;

    // save updated accounts list to disk
    await AccountRepository.saveAccounts(currentAccounts);

    return currentAccounts.accounts[accountIndex]
}


export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateBalance
}