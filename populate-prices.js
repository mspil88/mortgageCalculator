require("dotenv").config();

const connectDB = require("./db/connect");
const Prices = require("./models/house-prices");

const jsonPrices = require("./price_data/price_data.json");

const populateDB = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        await Prices.deleteMany();
        await Prices.create(jsonPrices);
        console.log("Prices successfully added");
    } catch (error) {
        console.log(error);
    }
};

populateDB();