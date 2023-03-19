import express from "express";
import AccountController from '../controllers/account.controller.js';

const router = express.Router();

router.post('/', AccountController.createAccount);
router.get('/', AccountController.getAccounts);
router.get('/:id', AccountController.getAccount);
router.delete('/:id', AccountController.deleteAccount);
router.patch('/updateBalance', AccountController.updateBalance);


// Generic error handling for all routes
router.use((err, req, res, next) => {
    global.logger.error(` ${req.method} /account${req.url}  ${err.message}`);
    res.status(400).send({ error: err.message });
});


export default router;