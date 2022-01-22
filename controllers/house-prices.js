const Price = require("../models/house-prices");
const asyncWrapper = require("../middleware/async");
const {createCustomError} = require("../errors/custom-error");


const getAggPrices = async (req, res) => {
    //destructor req.query
    //res.send("get prices");
    const query = req.query;
    const year = 2021;
    console.log(query);
    //be mindful of what the _id becomes once you group
    const averagePrice = await Price.aggregate( [
        {
          $group:
            {
              _id: "$year",
              avgprice: { $avg: "$price" },
              minprice: { $min: "$price" },
              maxprice: { $max: "$price" }
            }
        }
      ])
      .match({"_id": {"$gte": 2015}, "avgprice": {"$gt": 250000}})
      .sort("avgprice")
      ;
    res.status(200).json({averagePrice, num: averagePrice.length});

}

module.exports = getAggPrices;