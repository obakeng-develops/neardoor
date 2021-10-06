const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// Routers
const consumerRouter = require("./routes/consumer");
const storeRouter = require("./routes/store");
const courierRouter = require("./routes/courier");
const merchantRouter = require("./routes/merchant");
const feedRouter = require("./routes/feed");
const authRouter = require("./routes/auth");

// Dotenv Config
dotenv.config();

// Database connection
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, () => {
    console.log("Connected to Mongo.")
});

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/consumer", consumerRouter);
app.use("/api/store", storeRouter);
app.use("/api/courier", courierRouter);
app.use("/api/merchant", merchantRouter);
app.use("/api/feed", feedRouter);
app.use("/api/auth", authRouter);

// Server, port 8800
app.listen(8800, () => {
    console.log("Server is running.")
})