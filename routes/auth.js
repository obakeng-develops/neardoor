const router = require("express").Router();
const User = require("../models/User");
const Courier = require("../models/courier/Courier");
const Store = require("../models/store/Store");
const bcrypt = require("bcrypt");
const Token = require("../models/tokens/Token");
const jwt = require("jsonwebtoken");
const verifyToken = require("../config/jwt-verify");
const authorizeUser = require("../config/accesscontrol");

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        role: user.role
    }, 
    "mySecretKey",
    { expiresIn: "15m" }
    );
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        role: user.role
    }, 
    "myRefreshSecretKey"
    );
};

// Refresh token
router.post("/refresh", async (req, res) => {
    // Fetch refresh token
    const refreshToken = req.body.token;

    // Send error if token empty or invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated.");

    const refreshExists = await Token.exists({ refreshToken: refreshToken });

    if (!refreshExists) {
        return res.status(403).json("Refresh token is not valid!")
    }

    jwt.verify(refreshToken, "myRefreshSecretKey", async (err, user) => {
        err && console.log(err);

        const refreshTokens = await Token.findOneAndDelete({ refreshToken: refreshToken });

        const newAccessToken = generateAccessToken(user);

        const newRefreshToken = generateRefreshToken(user);

        const newToken = await new Token({
            userId: user.id,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

        await newToken.save();

        // If everything 200, create new access token
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            userId: user.id
        });
    });
});

// Log a user in.
router.post("/login", async (req, res) => {

    const user = await User.findOne({ email: req.body.email });

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (user && validPassword) {

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const newToken = await new Token({
            userId: user._id,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        await newToken.save();

        // Return successful result
        res.status(200).json({ 
            message: "Success", 
            user: user,
            accessToken,
            refreshToken
        });
    } else {

        // Return error
        res.status(400).json({ 
            message: "Email or password incorrect." 
        });
    }
});

// Register a consumer.
router.post("/consumer/register", async (req, res) => {
    try {
        // Salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = await new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        // Save new user
        await newUser.save();

        // Return successful result
        res.status(200).json({ message: "Consumer created.", consumer: newUser });
    } catch (err) {
        res.status(500).json({ message: "Could not create consumer." });
    }
});

// Register a merchant.
router.post("/merchant/register", async (req, res) => {
    try {
        // Salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = await new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        // Save new merchant
        await newUser.save();

        //Return successful result
        res.status(200).json({ message: "Merchant created.", merchant: newUser });
    } catch (err) {
        // Return erro
        res.status(500).json({ message: "Could not create merchant." });
    }
});

// Register a courier.
router.post("/courier/register", async (req, res) => {
    try {
        // Salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = await new User({
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        // Save new user
        await newUser.save();

        //Return successful result
        res.status(200).json({ 
            message: "Courier created.", 
            courier: newUser
        });
    } catch (err) {
        // Return error
        res.status(500).json({ 
            message: "Could not create courier." 
        });
    }
});

// Logout
router.post("/logout", verifyToken, async (req, res) => {
    const getRefreshToken = req.body.token;

    const getToken = await Token.findOneAndDelete({ refreshToken: getRefreshToken });

    res.status(200).json({ message: "Logged out succesfully." });
});

module.exports = router;