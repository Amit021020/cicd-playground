const express = require("express");
const router = express.Router();

const deploymentController = require("../controllers/deploymentController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", (req, res) => {
    res.render("dashboard/deploy");
});

router.post("/", isLoggedIn, deploymentController.deploy);

module.exports = router;