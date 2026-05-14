const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, projectController.getProjects);

module.exports = router;