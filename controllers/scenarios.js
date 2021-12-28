const Scenario = require("../models/scenario");
const asyncWrapper = require("../middleware/async");
const {createCustomError} = require("../errors/custom-error");
const { nextTick } = require("process");

const getAllScenarios = asyncWrapper(async (req, res) => {
    //res.send("get all scenarios");
    const scenarios = await Scenario.find({})
        //res.status(200).json({scenarios, numScenarios: scenarios.length})
        //res.status(200).json({success: true, data: {scenarios}})
    res.status(200).json({scenarios})
});

const createScenario = asyncWrapper(async (req, res) => {
    const scenario = await Scenario.create(req.body)
    res.status(201).json({scenario});
});

const getScenario = asyncWrapper(async (req, res) => {
    const {id:scenarioID} = req.params;
    const scenario = await Scenario.findOne({_id:scenarioID});
    if(!scenario) {
        return next(createCustomError(`No scenario with id: ${scenarioID}`, 404));
    }
    res.status(200).json({scenario});
});

const deleteScenario = asyncWrapper(async (req, res) => {
    const {id:scenarioID} = req.params;
    const scenario = await Scenario.findOneAndDelete({_id:scenarioID});
    if(!scenario) {
        return next(createCustomError(`No scenario with id: ${scenarioID}`, 404));
    }
    res.status(200).json({scenario});
});

module.exports = {
    getAllScenarios,
    createScenario,
    getScenario,
    deleteScenario
}