const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../configs/config");

function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        jwtSecret,
        { expiresIn: "1d" }
    );
}

module.exports = { generateToken };