const express = require("express");
const router = express.Router();

const logsController = require("../controllers/logsController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/:id", isLoggedIn, logsController.getLogs);

module.exports = router;