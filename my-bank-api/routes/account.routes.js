import express from "express";
import { promises as fs } from "fs";
import AccountController from '../controllers/account.controller.js';

const router = express.Router();

// POST request in '/'
// Creates a new account
router.post('/', AccountController.createAccount);


// GET request in '/'
// Returns all accounts
router.get('/', AccountController.getAccounts);


// GET request in '/:id'
// Returns specific accounts
router.get('/:id', AccountController.getAccount);


// DELETE request in '/:id'
// Delete specific account
router.delete('/:id', AccountController.deleteAccount);


// PATCH request in '/updateBalance'
// Update account's balance based on request body (id, balance)
router.patch('/updateBalance', AccountController.updateBalance);


// Generic error handling for all routes
router.use((err, req, res, next) => {
    global.logger.error(` ${req.method} /account${req.url}  ${err.message}`);
    res.status(400).send({ error: err.message });
});


export default router;