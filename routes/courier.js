const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/order/Order");
const Fleet = require("../models/courier/Fleet");
const Courier = require("../models/courier/Courier");
const Vehicle = require("../models/courier/Vehicle");
const Delivery = require("../models/courier/Delivery");

// Create courier profile
router.post("/create", async (req, res) => {
    try {

        // Fetch User
        const fetchUser = await User.findById(req.body.userId);

        // Create new courier
        const newCourier = await new Courier({
            userId: req.body.userId
        });

        // Save courier
        await newCourier.save();

        // Return successful result
        res.status(200).json({
            message: "Courier created.",
            user: fetchUser
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't create profile."
        })
    }
});

// Retrieve all couriers.
router.get("/all", async (req, res) => {
    try {

        // Find couriers
        const couriers = await User.find().exec();

        // Return result
        res.status(200).json({ 
            message: "Couriers found.",
            couriersList: couriers
        });
    } catch (err) {
        // Return internal server error
        res.status(500).json({ message: "Couldn't fetch couriers.", error: err });
    }
});

// Retrieve specific courier.
router.get("/:id", async (req, res) => {
    try {

        // Find courier
        const fetchCourier = await Courier.findById(req.params.id);

        // Return result
        res.status(200).json({ 
            message: "Courier found.",
            courier: fetchCourier
        });
    } catch (err) {
        // Return internal server error
        res.status(500).json({ message: "Couldn't fetch couriers.", error: err });
    }
});

// Update specific courier.
router.put("/courier/:id", async (req, res) => {
    try {

        // Get courier
        const getCourier = await Courier.findByIdAndUpdate(req.params.id, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            message: "Courier updated.",
            data: getCourier
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't update courier."
        });
    }
});

// View order.
router.get("/order/:id", async (req, res) => {
    try {

        // Find Order
        const fetchOrder = await Order.findById(req.params.id);

        // Return result
        res.status(200).json({ 
            message: "Order found.",
            order: fetchOrder
        });
    } catch (err) {
        // Return internal server error
        res.status(500).json({ message: "Couldn't fetch Order.", error: err });
    }
});

// Accept delivery.
router.post("/order/:orderId/accept", async (req, res) => {
    try {

        // Get order
        const getOrder = await Order.findById(req.params.orderId);

        // Create new delivery
        const createDelivery = await new Delivery({
            orderId: req.params.orderId,
            deliveryAddress: req.body.deliveryAddress,
            deliveryTime: {
                deliveryStartTime: req.body.deliveryStartTime,
                deliveryEndTime: req.body.deliveryEndTime
            },
            courierId: req.body.courierId
        });

        // Save delivery information
        await createDelivery.save();

        const getDelivery = await Delivery.findById(createDelivery._id);

        // Return successful result
        res.status(200).json({
            message: "Delivery accepted.",
            data: getDelivery
        });
    } catch {
        //Return error
        res.status(500).json({
            message: "Delivery could not be accepted."
        });
    }
});

// Cancel delivery.
router.put("/order/:orderId/cancel", async (req, res) => {
    try {

        // Get order
        const getOrder = await Order.findByIdAndUpdate(req.params.orderId, {
            $set: {
                deliveryStatus: "cancelled"
            }
        })

        // Return successful result
        res.status(200).json({
            message: "Delivery cancelled.",
            data: getOrder
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't cancel delivery."
        });
    }
});

// Add fleet.
router.post("/fleet/add", async (req, res) => {
    try {

        // Fetch courier
        const fetchCourier = await Courier.findOne({ userId: req.body.userId });

            // Create new fleet
            const newFleet = await new Fleet({
                fleetName: req.body.fleetName
            });

            // Save new fleet
            await newFleet.save();

            // Update courier fleet
            await fetchCourier.updateOne({
                $push: {
                    fleet: newFleet._id.toString()
                }
            });

            res.status(200).json({ 
                message: "Fleet added.",
                courier: fetchCourier
            });

    } catch (err) {
        res.status(500).json({
            message: "Fleet couldn't be added."
        })
    }
});

// List of fleets.
router.get("/fleet/all", async (req, res) => {
    try {
        // Fetch fleets
        const fetchFleets = await Fleet.find().exec();

        // Return successful result
        res.status(200).json({
            message: "Fleets found.",
            fleets: fetchFleets
        });
    } catch (err) {
        res.status(500).json({
            message: "Couldn't fetch fleets."
        });
    }
});

// Add vehicle to fleet.
router.post("/fleet/:id/vehicle/add", async (req, res) => {
    try{
        
        const fetchFleet = await Fleet.findById(req.params.id);

        const newVehicle = await new Vehicle({
            vehicleManufacturer: req.body.vehicleManufacturer,
            vehicleYear: req.body.vehicleYear,
            vehicleModel: req.body.vehicleModel,
            vehicleNumberPlate: req.body.vehicleNumberPlate
        });

        await newVehicle.save();

        await fetchFleet.updateOne({
            $push: {
                vehicles: newVehicle._id.toString()
            }
        })

        res.status(200).json({
            message: "Vehicle added",
            vehicles: newVehicle
        })

    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't add vehicle."
        });
    }
});

// Retrieve a vehicle.
router.get("/fleet/vehicle/:vehicleId", async (req, res) => {
    try {
        // Fetch vehicle
        const fetchVehicle = await Vehicle.findById(req.params.vehicleId);

        // Return successful result
        res.status(200).json({
            message: "Vehicle found.",
            vehicle: fetchVehicle
        });
    } catch (err) {
        //Return error
        res.status(500).json({
            message: "Couldn't fetch vehicle."
        });
    }
});

// Update a vehicle.
router.put("/fleet/vehicle/:vehicleId", async (req, res) => {
    try {

        // Get vehicle
        const getVehicle = await Vehicle.findByIdAndUpdate(req.params.vehicleId, {
            $set: req.body
        });

        // Return successful result
        res.status(200).json({
            message: "Vehicle updated.",
            data: getVehicle
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't update vehicle."
        });
    }
});

// List all vehicles in a fleet.
router.get("/fleet/:fleetId/vehicle/all", async (req, res) => {
    try {

        // Get fleet
        const getFleet = await Fleet.findById(req.params.fleetId);

        // Get vehicles in fleet
        const fleetVehicles = await Promise.all(
            getFleet.vehicles.map(vehicleId => {
                return Vehicle.findById(vehicleId);
            })
        );

        // Return successful result
        res.status(200).json({
            fleet: fleetVehicles,
            message: "Vehicles found."
        });

    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't find vehicles."
        });
    }
});

// List all couriers in a fleet.

module.exports = router;
