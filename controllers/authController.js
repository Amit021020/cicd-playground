const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/jwt");

// REGISTER
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.send("All fields are required");
        }

        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.send("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = generateToken(user);

        res.cookie("token", token, { httpOnly: true });

        return res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
};
exports.showRegister = (req,res)=>{
    res.render("auth/register")
}

// LOGIN
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.send("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.send("Invalid credentials");

        const token = generateToken(user);

        res.cookie("token", token, { httpOnly: true });

        return res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
};
exports.showLogin = (req,res)=>{
    res.render("auth/login")
}


// LOGOUT
exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
};