import { promises as fs } from "fs";

async function getAccounts() {
    const currentAccounts = JSON.parse(await fs.readFile(global.fileName));
    return currentAccounts;
}

async function saveAccounts(accounts) {
    await fs.writeFile(global.fileName, JSON.stringify(accounts, null, 2));
}

export default {
    getAccounts,
    saveAccounts
}