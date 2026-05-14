require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./configs/config");

const connectDB = require("./configs/mongoose-connection");

connectDB();

// ROUTES
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const deploymentRoutes = require("./routes/deploymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const logsRoutes = require("./routes/logsRoutes");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// ROUTES
app.use(authRoutes);
app.use("/project", projectRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/deploy", deploymentRoutes);
app.use("/deployments/logs", logsRoutes);


app.listen(config.port, () => {
    console.log("Server running on port", config.port);
});