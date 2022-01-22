const express = require("express");
const router = express.Router();

const getAggPrices = require("../controllers/house-prices");
router.route('/').get(getAggPrices);

module.exports = router;
