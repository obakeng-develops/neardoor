const router = require("express").Router();
const Store = require("../models/store/Store");
const Menu = require("../models/store/Menu");
const MenuItem = require("../models/store/MenuItem");
const MenuCategory = require("../models/store/MenuCategory");
const StoreAddress = require("../models/store/StoreAddress");
const verifyToken = require("../config/jwt-verify");
const authorizeUser = require("../config/accesscontrol");

// List of all stores.
router.get("/all", async (req, res) => {

    let store = []
    try {
        //Find all stores
        store = await Store.aggregate([{
            $sample: {
                size: 10
            }
        }]);

        // Return result
        res.status(200).json({ message: "Stores found.", stores: store });

    } catch (err) {
        res.status(500).json({ message: "Could not find stores." });
    }
});

// Retrieve a specific store.
router.get("/:id", verifyToken, authorizeUser.grantAccess("readAny", "store"), async (req, res) => {
    try {

        //Find store by ID
        const storeById = await Store.findById({ _id: req.params.id });

        // Return result
        res.status(200).json({ message: "Store found", store: storeById });
    } catch (err) {
        res.status(500).json({ message: "Could not fetch store." });
    }
});

// Update a specific store.
router.put("/:id", verifyToken, authorizeUser.grantAccess("updateOwn", "store"), async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Retrieve params
        const storeId = req.params.id;

        // Find user and update
        await Store.findByIdAndUpdate(storeId, {
            $set: req.body
        });

        // Retrieve user
        const user = await Store.findById(storeId);

        // Return successful result
        res.status(200).json({
            data: user,
            message: "Store updated."
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't update store.",
            error: err
        });
    }
});

// Add a store.
router.post("/add", verifyToken, authorizeUser.grantAccess("createOwn", "store"), async (req, res) => {
    try {

        // Create store
        const newStore = await new Store({
            storeName: req.body.storeName,
            operatingHours: {
                from: req.body.operatingHours.from,
                to: req.body.operatingHours.to
            },
            managedBy: req.body.managedBy,
        });

        // Save store
        await newStore.save();

        // Return result
        res.status(200).json({ message: "Store is added." });

    } catch (err) {

        // Return error
        res.status(500).json({ message: "Could not add store." });
    }
});

// Add menu to a store.
router.post("/:id/menu/add", verifyToken, authorizeUser.grantAccess("createOwn", "menu"), async (req, res) => {
    try {

        // Retrieve store
        const findStore = await Store.findById(req.params.id);

        if (findStore) {
            // Create new menu
            const newMenu = await new Menu({ 
                menuName: "Breakfast Menu",
                menuTime: {
                    menuStartTime: "2021-09-01 08:00:00",
                    menuEndTime: "2021-09-01 11:00:00"
                }
            });

            // Save menu
            await newMenu.save();

            // Add menu to store
            await findStore.updateOne({
                $push: {
                    menus: newMenu._id.toString()
                }
            });

            // Return result
            res.status(200).json({ message: "Added menu", menu: newMenu });
        } else {
            res.status(404).json({ message: "Store does not exist." });
        }

    } catch (err) {
        res.status(500).json({ message: "Could not add menu." });
    }
});

// Retrieve a menu.
router.get("/:storeId/menu/:menuId", async (req, res) => {
    try {
        const findStore = await Store.findById(req.params.storeId);

        const findMenu = await Menu.findById(req.params.menuId);

        res.status(200).json({ message: "Menu found", store: findStore, menu: findMenu });

    } catch (err) {
        res.status(500).json({ message: "Could not find menu." });
    }
});

// Update a menu.
router.put("/:storeId/menu/:menuId", verifyToken, authorizeUser.grantAccess("createOwn", "menu"), async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Retrieve menu id
        const menuId = req.params.menuId;

        // Retrieve store id
        const storeId = req.params.storeId;

        // Find user and update
        await Menu.findByIdAndUpdate(menuId, {
            $set: req.body
        });

        // Retrieve user
        const menu = await Menu.findById(menuId);

        // Return successful result
        res.status(200).json({
            data: menu,
            message: "Store updated."
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't update store.",
            error: err
        });
    }
});

// Add an address.
router.post("/:id/address/add", verifyToken, authorizeUser.grantAccess("createOwn", "address"), async (req, res) => {
    try {

        // Find store
        const findStore = await Store.findById(req.params.id);

        if (findStore) {
            // Create address
            const newAddress = await new StoreAddress({
                streetAddress: req.body.streetAddress,
                surburb: req.body.surburb,
                city: req.body.city,
                longitude: req.body.longitude,
                latitude: req.body.latitude,
                country: req.body.country,
                zipCode: req.body.zipCode,
            });

            // Save address
            await newAddress.save();

            // Add address to store
            await findStore.updateOne({
                $push: {
                    storeAddress: newAddress._id.toString()
                }
            });

            // Return result
            res.status(200).json({ message: "Address is added.", address: newAddress });
        } else {
            res.status(404).json({ message: "Store does not exist." });
        }

    } catch (err) {
        res.status(500).json({ message: "Could not add store." });
    }
});

// Create a discount.

// Retrieve store address.
router.get("/:id/address", verifyToken, authorizeUser.grantAccess("createOwn", "address"), async (req, res) => {
    try {

        // Find store
        const findStore = await Store.findById(req.params.id);

        // Find store address
        const findAddress = await StoreAddress.findById(findStore.storeAddress);

        // Return result
        res.status(200).json({ message: "Store found", address: findAddress });
    } catch (err) {
        res.status(500).json({ message: "Could not fetch address." });
    }
});

// Update store address
router.put("/address/:addressId", verifyToken, authorizeUser.grantAccess("createOwn", "address"), async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Store address ID
        const storeAddress = req.params.addressId;

        // Find user and update
        await StoreAddress.findByIdAndUpdate(storeAddress, {
            $set: updateData
        });

        const findStoreAddress = await StoreAddress.findById(storeAddress);

        // Return successful result
        res.status(200).json({
            data: findStoreAddress,
            message: "Store address updated."
        });

    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't update store address.",
            error: err
        });
    }
});

// Delete store address.
router.delete("/address/:id", verifyToken, authorizeUser.grantAccess("deleteOwn", "menu"), async (req, res) => {
    try {
        
        // Get store address ID
        const getStoreAddress = await StoreAddress.findByIdAndDelete(req.params.id);

        // Return successful result
        res.status(200).json({
            message: "Store Address deleted.",
            data: getStoreAddress
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't delete address."
        });
    }
});

// Add menu item
router.post("/menu/:id/item/add", verifyToken, authorizeUser.grantAccess("createOwn", "menu"), async (req, res) => {
    try {

        // Find menu
        const menu = Menu.findById(req.params.id);

        // Create new menu item
        const newMenuItem = await new MenuItem({
            menuItemName: req.body.menuItemName,
            menuItemPrice: req.body.menuItemPrice,
            menuItemDescription: req.body.menuItemDescription
        });

        // Save new menu item
        await newMenuItem.save();

        // Update menu
        const updateMenu = await menu.updateOne({
            $push: {
                menuItems: newMenuItem._id
            }
        })

        // Return successful result
        res.status(200).json({
            message: "Menu item added"
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't add menu item."
        });
    }
});

// Get menu item
router.get("/menu/item/:id", verifyToken, authorizeUser.grantAccess("readOwn", "menu"), async (req, res) => {
    try {

        // Get menu item
        const menuItem = await MenuItem.findById(req.params.id);

        // Return successful result
        res.status(200).json({
            message: "Menu item fetched.",
            data: menuItem
        });
    } catch (err) {

        // Return error
        res.status(500).json({
            message: "Couldn't fetch item."
        });
    }
});

// Update menu item
router.put("/menu/item/:id", async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Retrieve menu id
        const menuItemId = req.params.id;

        // Find user and update
        await MenuItem.findByIdAndUpdate(menuItemId, {
            $set: updateData
        });

        // Retrieve user
        const menuItem = await MenuItem.findById(menuItemId);

        // Return successful result
        res.status(200).json({
            data: menuItem,
            message: "Store updated."
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Menu item updated."
        });
    }
});

// Delete menu item
router.delete("/menu/item/:id", verifyToken, authorizeUser.grantAccess("deleteOwn", "menu"), async (req, res) => {
    try {

        // Retrieve fields to update
        const updateData = req.body;

        // Retrieve menu id
        const menuItemId = req.params.id;

        // Find user and update
        await MenuItem.findByIdAndDelete(menuItemId);

        // Retrieve user
        const menuItem = await MenuItem.findById(menuItemId);

        // Return successful result
        res.status(200).json({
            data: menuItem,
            message: "Store updated."
        });
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Menu item updated."
        });
    }
});

// Add menu category - Add verification
router.post("/menu/:id/category/add", async (req, res) => {
    try {

        // Fetch menu
        const fetchMenu = await Menu.findById(req.params.id);

        // Create new menu category
        const createMenuCategory = await MenuCategory({
            menuCategoryName: req.body.menuCategoryName,
            menuId: req.params.id
        });

        // Save menu category
        await createMenuCategory.save();

        // Return successful result
        res.status(200).json({
            message: "Menu category added."
        })
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't add menu category."
        })
    }
});

// Add menu item to menu category - Add verification, to documentation
router.post("/menu/:id/item/:itemId/add", async (req, res) => {
    try {

        // Query
        const query = { 
            menuId: req.params.id, 
            menuCategoryName: req.body.menuCategoryName 
        }

        // Fetch menu category
        const fetchMenuCategory = await MenuCategory.findOneAndUpdate(
            query,
            {
                $push: {
                    menuItems: req.params.itemId
                }
            }
        );

        // Return successful result
        res.status(200).json(fetchMenuCategory);
    } catch (error) {
        // Return error
        res.status(500).json({
            message: "Couldn't add menu item to category."
        });
    }
});

// Retrieve menu categories with associated menu items
router.get("/menu/:menuId/items", async (req, res) => {
    try {

        // Fetch menu category
        const fetchMenuCategory = await MenuCategory.find({
            menuId: req.params.menuId
        });

        // Fetch items within menu category
        // const fetchItems = await Promise.all(
        //     fetchMenuCategory.map((menu) => {
        //         const headings = menu.menuCategoryName
        //         const getMenuItems = menu.menuItems
                
        //         return {
        //             headings,
        //             getMenuItems
        //         }
        //     })
        // );

        // Something
        const fetchItems = await Menu.aggregate([
            {
                $lookup: {
                    from: "MenuItem",
                    localField: "_id",
                    foreignField: "menuItems",
                    as: "menu_data"
                }
            }
        ])

        // Return successful result
        res.status(200).json(fetchItems);
    } catch (error) {
        // Return error
        res.status(500).json({
            message: "Couldn't retrieve menu categories and menu items"
        });
    }
});

// Retrieve all menu categories for specific menu - Add verification
router.get("/menu/:id/categories", async (req, res) => {
    try {

        // Fetch all categories
        const fetchCategories = await MenuCategory.find({ menuId: req.params.id})

        // Return successful result
        res.status(200).json(fetchCategories);
    } catch (err) {
        // Return error
        res.status(500).json({
            message: "Couldn't fetch menu categories."
        });
    }
});


module.exports = router;