const router = require("express").Router();
const List = require("../models/List");
const Store = require("../models/store/Store");
const Menu = require("../models/store/Menu");
const MenuItem = require("../models/store/MenuItem");
const MenuCategory = require("../models/store/MenuCategory");

// Retrieve list schema showing all stores and their list titles.
router.get("/", async (req, res) => {
    let list = []

    try {

        // Aggregate lists
        list = await List.aggregate([{
            $sample: {
                size: 3
            }
        }
        ]).exec();

        // Return results
        res.status(200).json(list);

    } catch (err) {
        res.status(500).json({ message: "Could not fetch lists." });
    }

});

// Add new list
router.post("/list/add", async (req, res) => {
    try {

        // Create new list
        const newList = await new List({
            title: req.body.title,
            description: req.body.description
        });

        // Save list
        await newList.save();

        //Return result
        res.status(200).json({ message: "Added new list", list: newList });

    } catch (err) {
        res.status(500).json({ message: "Could not add list." });
    }
});

// Add store to list
router.post("/list/:listId/store/:storeId", async (req, res) => {
    try {
        // Find list
        const findList = await List.findById(req.params.listId);

        // Find store
        const findStore = await Store.findById(req.params.storeId);

        // Update lists
        const updatedList = await findList.updateOne({ 
            $push: {
                restaurants: findStore._id.toString()
            }
         });

         // Return results
         res.status(200).json({ message: "Store added to list", list: findList });

    } catch (err) {
        res.status(500).json({ message: "Could not add store to list." });
    }
});

// Retrieve a specific store. - Add to documentation
router.get("/store/:id", async (req, res) => {
    try {

        //Find store by ID
        const storeById = await Store.findById({ _id: req.params.id });

        // Return result
        res.status(200).json(storeById);
    } catch (err) {
        res.status(500).json({ message: "Could not fetch store." });
    }
});

// Retrieve menu items and categories - Add to documentation
router.get("/menu/:id/items", async (req, res) => {
    try {

        // Fetch menu
        const fetchMenu = await Menu.findById(req.params.id);

        // Fetch menu items in specific menu
        const fetchMenuItems = await Promise.all(
            fetchMenu.menuItems.map(menuItemId => {
                return MenuItem.findById(menuItemId);
            })
        );

        // Fetch Menu Categories
        const fetchMenuCategories = await MenuCategory.find({
            menuId: fetchMenu._id
        })

        // Return successful result
        res.status(200).json({
            menuHeader: fetchMenuCategories,
            menu: fetchMenuItems
        })
    } catch (err) {
        //Return error
        res.status(500).json({
            message: "Couldn't fetch menu items."
        });
    }
});

module.exports = router;