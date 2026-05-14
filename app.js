require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const config = require("./configs/config");

mongoose.connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
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
app.get("/",(req,res)=>{
    console.log(config.mongoURI)
})
app.use(authRoutes);
app.use("/project", projectRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/deploy", deploymentRoutes);
app.use("/deployments/logs", logsRoutes);

const config = require("./configs/config");

app.listen(config.port, () => {
    console.log("Server running on port", config.port);
});