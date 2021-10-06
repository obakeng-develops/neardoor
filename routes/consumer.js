const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/order/Order");
const OrderItem = require("../models/order/OrderItem");
const MenuItem = require("../models/store/MenuItem");
const Store = require("../models/store/Store");
const verifyToken = require("../config/jwt-verify");
const authorizeUser = require("../config/accesscontrol");

// Retrieve all consumers
router.get("/all", async (req, res) => {
    try {

        // Find consumers
        const consumers = await User.find().where({ role: "consumer" });

        // Return result
        res.status(200).json({ 
            message: "Consumers found.",
            consumersList: consumers
        });
    } catch (err) {
        // Return internal server error
        res.status(500).json({ message: "Couldn't fetch users.", error: err });
    }
});

// Retrieve specific customer.
router.get("/:id", verifyToken, authorizeUser.grantAccess("readOwn", "profile"), async (req, res) => {
    try {
        // Find consumer
        const consumer = await User.findById(req.params.id);

        // Return result
        res.status(200).json({
            message: "User found.",
            consumer: consumer
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Could not find consumer."
        });
    }
});

// Update specific customer.
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
            message: "Consumer updated."
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't update consumer.",
            error: err
        });
    }
});

// Retrieve an order.
router.get("/order/:id", authorizeUser.grantAccess("readOwn", "order"), async (req, res) => {
    try {
        // Fetch order
        const fetchOrder = await Order.findById(req.params.id);

        // Return successful result
        res.status(200).json({
            message: "Order found.",
            order: fetchOrder
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Could not fetch order."
        })
    };
});

// Update an order.
router.put("/order/:id", async (req, res) => {
    try {

        // Update data
        const updateData = req.body;

        // Update order
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: updateData
        });

        // Return successful result
        res.status(200).json({
            message: "Order updated."
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't update order."
        });
    }
});

// Create a new order.
router.post("/:id/order/:storeId/create", verifyToken, authorizeUser.grantAccess("updateOwn", "profile"),  async (req, res) => {
    try {
        // Create order
        const createOrder = await new Order({
            orderNumber: req.body.orderNumber,
            isDeliveryOrder: req.body.isDeliveryOrder,
            isScheduledOrder: req.body.isScheduledOrder,
            orderedBy: {
                userId: req.params.id,
                storeId: req.params.storeId
            }
        });

        // Save order
        await createOrder.save();

        // Return result
        res.status(200).json({ 
            message: "Order created",
            order: createOrder
        });
    } catch (err) {
        //Return catched error
        res.status(500).json({
            message: "Could not create an order."
        });
    }
});

// Track an order.
router.get("/order/:id/track", (req, res) => {

});

// Cancel an order.
router.put("/order/:id/cancel", async (req, res) => {
    try {

        // Fetch update data
        const updateData = req.body;

        // Get order and update
        const order = await Order.findByIdAndUpdate(req.params.id, {
            $set: updateData
        });

        // Get order
        const getOrder = await Order.findById(req.params.id);


        // Return succesful result
        res.status(200).json({
            data: getOrder,
            message: "Order cancelled."
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't cancel order."
        });
    }
});

// Add order item to order.
router.post("/order/:orderId/add/:itemId", async (req, res) => {
    try {

        // Get order 
        const getOrder = await Order.findById(req.params.orderId);

        // Create order item
        const createOrderItem = await new OrderItem({
            menuItem: req.params.itemId,
            orderItemQuantity: req.body.orderItemQuantity,
            extraNote: req.body.extraNote
        });

        // Save order item
        await createOrderItem.save();

        await getOrder.updateOne({
            $push: {
                orderItems: createOrderItem._id.toString()
            }
        });

        // Return succesful result
        res.status(200).json({
            message: "Order item added.",
            orderItem: createOrderItem,
            order: getOrder
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't add order item."
        });
    }
});

// Schedule order.
router.post("/order/:id/schedule", (req, res) => {

});

// Add store to your favourites list.
router.post("/store/:id/favourite", async (req, res) => {
    try {

        // Find Store
        const findStore = await Store.findById(req.params.id);

        // Find User
        const findUser = await User.findById(req.body.userId);

        // Add store to favourite list
        const addStoreToFavourite = await findUser.updateOne({
            $push: {
                favouriteStores: findStore._id.toString()
            }
        });

        // Return successful result
        res.status(200).json({
            message: "Store added as favourite",
            store: findUser
        });
    } catch (err) {
        //Return error result
        res.status(500).json({ 
            message: "Could not add store to your favourites."
         });
    }
});

module.exports = router;