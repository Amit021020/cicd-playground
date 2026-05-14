const jwt = require("jsonwebtoken");
const config = require("../config/config");

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        config.jwtSecret,
        { expiresIn: "1d" }
    );
}

module.exports = { generateToken };