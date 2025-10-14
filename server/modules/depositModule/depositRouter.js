const express = require("express");
const AuthMiddleware = require("../../middlewares/userAuthMiddleware");
const userDepositController = require("./depositController");
const router = express.Router();

router.get('/deposit-history', AuthMiddleware, userDepositController.getUserDeposits);
router.post("/deposit", AuthMiddleware, userDepositController.createDeposit);
router.get("/deposit/:id", AuthMiddleware, userDepositController.getDeposit);

module.exports = router;