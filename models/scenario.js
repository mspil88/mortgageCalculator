const mongoose = require("mongoose");

const ScenarioSchema = new mongoose.Schema({
    balance: {
        type:Number,
        required: [true, "must provide a balance"],
    }, 
    term: {
        type: String,
        required: [true, "must provide a term"],
    },
    interestRate: {
        type:Number,
        required: [true, "must provide an interest rate"],
    }, 
    extraPayment: {
        type:Number,
        defaut: 0,
    }, 
    lumpSum: {
        type:Number,
        default: 0,
    },
    monthlyPayment: {
        type:Number,
        
    },
    newMonthlyPayment: {
        type:Number,
        
    },
    termReduction: {
        type:String,
        
    },
    interestSaved: {
        type:Number,
        
    }, 
});

module.exports = mongoose.model('Scenario', ScenarioSchema);