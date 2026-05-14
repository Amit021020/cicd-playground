const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const config = require("../configs/config");

async function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.redirect("/login");

    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        const user = await userModel.findById(decoded.id);

        if (!user) return res.redirect("/login");

        req.user = user;
        next();

    } catch (err) {
        return res.redirect("/login");
    }
}

module.exports = isLoggedIn;