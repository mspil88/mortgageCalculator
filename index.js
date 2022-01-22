const express = require("express");
const app = express();
const scenarios = require("./routes/scenarios");
const prices = require("./routes/house-prices");
const pricesAll = require("./routes/house-price-all");
const logger = require("./middleware/logger");
const connectDB = require("./db/connect");
require("dotenv").config();
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

//middleware
app.use(express.static('./public'));
app.use(express.json());
app.use(logger);

app.use("/api/v1/scenarios", scenarios);
app.use("/api/v1/prices", prices);
app.use("/api/v1/prices_all", pricesAll);
app.use(notFound);
app.use(errorHandler);

// app.get('/api/v1/scenarios') get request on existing scenarios
// app.post('/api/v1/scenarios') post to add scenario
// app.get('/api/v1/scenarios/:id') get a single scenario ???
// app.delete('/api/v1/scenarios/:id') delete to delete scenario

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, ()=> {
            console.log(`server listening on port: ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

start();

