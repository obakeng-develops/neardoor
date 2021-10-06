const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    // Fetch authorization
    const authHeader = req.headers.authorization;

    // If authorization
    if (authHeader) {
        // Fetch token
        const token = authHeader.split(" ")[1];

        // Verify JWT
        jwt.verify(token, "mySecretKey", (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
        }

        // Assign payload to user
        req.user = user;

        next();
        });
    } else {
        res.status(401).json("You need to be logged in to accesss this route.");
    }
};

module.exports = verify;