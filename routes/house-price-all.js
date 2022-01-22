const express = require("express");
const router = express.Router();

const getAllPrices = require("../controllers/house-prices-all");
router.route('/').get(getAllPrices);

module.exports = router;
