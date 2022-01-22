const Price = require("../models/house-prices");
const asyncWrapper = require("../middleware/async");
const {createCustomError} = require("../errors/custom-error");


const defineOperators = {
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '=': 'eq'
}

const getAllPrices = async (req, res) => {
    const {outward_postcode, postcode, city, 
        region, property_type, filterNumericValues} = req.query;
    const myQuery = {};

    if(outward_postcode) {
        myQuery['outward_postcode'] = outward_postcode.toUpperCase();
    } 

    if(postcode) {
        myQuery['postcode'] = postcode.toUpperCase();
    }

    if(city) {
        myQuery['city'] = city.toUpperCase();
    }

    if(region) {
        myQuery['region'] = region.toUpperCase();
    }

    if(property_type) {
        myQuery['property_type'] = property_type.toLowerCase();
    }

    if(filterNumericValues) {
        console.log(filterNumericValues);
        const matchOperation = /\b(<|>|>=|=|<|<=)\b/g;
        const numericOptions = ["price", "year"];
        let myFilters = filterNumericValues.replace(matchOperation, m=> `-${defineOperators[m]}-`
        )
        console.log(`FILTERS: ${myFilters}`);
        myFilters = myFilters.split(",").forEach((itm)=> {
            const [field, operator, value] = itm.split("-");
            if(numericOptions.includes(field)) {
                myQuery[field] = {[operator]: Number(value)}
            }
        })
        console.log(myFilters);

    }
    
    console.log(myQuery);
    
    //const prices = await Price.find(myQuery).limit(10);
    const prices = await Price.find(myQuery);
    res.status(200).json({prices, numProperties: prices.length});
}

module.exports = getAllPrices;