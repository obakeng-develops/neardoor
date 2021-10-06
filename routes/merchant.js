const router = require("express").Router();
const User = require("../models/User");
const Store = require("../models/store/Store");
const Order = require("../models/order/Order");
const verifyToken = require("../config/jwt-verify");
const authorizeUser = require("../config/accesscontrol");

// Update a merchant.
router.put("/:id", verifyToken, authorizeUser.grantAccess("updateOwn", "profile"), async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Retrieve params
        const userId = req.params.id;

        // Find user and update
        await User.findByIdAndUpdate(userId, {
            $set: req.body
        });

        // Retrieve user
        const user = await User.findById(userId);

        // Return successful result
        res.status(200).json({
            data: user,
            message: "Merchant updated."
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't update merchant.",
            error: err
        });
    }
});

// Retrieve a merchant.
router.get("/:id", verifyToken, authorizeUser.grantAccess("readOwn", "profile"), async (req, res) => {
    try {

        // Retrieve merchant
        const getMerchant = await User.findById(req.params.id).where({ role: "merchant" });

        // Return successful result
        res.status(200).json({
            message: "Merchant retrieved.",
            data: getMerchant
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Could not retrieve merchant."
        });
    }
});

// Accept an order.
router.put("/order/:orderId/accept", async (req, res) =>{
    try {

        // Get the order and update
        const getOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: {
                isOrderAccepted: true
            }
        });

        // Return successful result
        res.status(200).json({
            data: getOrder,
            message: "Order accepted."
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't accept order."
        });
    }
});

// Cancel an order.
router.put("/order/:orderId/cancel", async (req, res) => {
    try {

        // Get the order and update
        const getOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            data: getOrder,
            message: "Order accepted."
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't accept order."
        });
    }
});

// Reject an order.
router.put("/order/:orderId/reject", async (req, res) =>{
    try {

        // Get the order and update
        const getOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: {
                isOrderAccepted: req.body.isOrderAccepted
            }
        });

        // Return successful result
        res.status(200).json({
            data: getOrder,
            message: "Order accepted."
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't accept order."
        });
    }
});

// Change status of an order.
router.put("/order/:orderId/status", async (req, res) =>{
    try {

        // Get order
        const getOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            message: "Order status changed.",
            data: getOrder
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't change order status."
        });
    }
});

// Retrieve order by incoming - Add to documentation
router.get("/order/incoming/store/:id", async (req, res) => {
    try {

        // Fetch orders
        const fetchOrders = await Order.find({
            storeId: req.params.id
        }).where({
            orderStatus: "incoming"
        });

        // Fetch orders with users
        const fetchOrdersWithUsers = await User.aggregate([
            {
                "$lookup": {
                    "from": "order",
                    "localField": "_id",
                    "foreignField": "orderedBy.userId",
                    "as": "order"
                }
            }
        ])


        // Return successful
        res.status(200).json({
            message: "Hey",
            fetch: fetchOrdersWithUsers
        })
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't retrieve incoming orders."
        })
    }
});

// Retrieve order by outgoing - Add to documentation
router.get("/order/outgoing/store/:id", async (req, res) => {
    try {

        // Fetch orders
        const fetchOrders = await Order.find({
            storeId: req.params.id
        }).where({
            orderStatus: "outgoing"
        });

        // Return successful
        res.status(200).json(fetchOrders)
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't retrieve incoming orders."
        })
    }
});

// Retrieve order by outgoing - Add to documentation
router.get("/order/ready/store/:id", async (req, res) => {
    try {

        // Fetch orders
        const fetchOrders = await Order.find({
            storeId: req.params.id
        }).where({
            orderStatus: "ready"
        });

        // Return successful
        res.status(200).json(fetchOrders)
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't retrieve incoming orders."
        })
    }
});

// Pause store orders.
router.put("/store/:storeId/pause", async (req, res) => {
    try {

        // Get store and update
        const getStore = await Store.findByIdAndUpdate(req.params.storeId, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            message: "Order status changed.",
            data: getStore
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't change order status."
        });
    }
});

// Unpause store orders.
router.put("/store/:storeId/unpause", async (req, res) => {
    try {

        // Get store and update
        const getStore = await Store.findByIdAndUpdate(req.params.storeId, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            message: "Order status changed.",
            data: getStore
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't change order status."
        });
    }
});

module.exports = router;