const express = require("express");
const router = express.Router();

const {getAllScenarios, createScenario, getScenario, deleteScenario} = require("../controllers/scenarios");

router.route("/").get(getAllScenarios).post(createScenario);
router.route("/:id").get(getScenario).delete(deleteScenario);


module.exports = router;
