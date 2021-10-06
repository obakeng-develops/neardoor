const AccessControl = require("accesscontrol");

let grants = {
    consumer: {
        profile: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        order: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        store: {
            "read:any": ["*"]
        },
        feed: {
            "read:any": ["*"]
        }
    },
    merchant: {
        profile: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        order: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        menu: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"],
            "delete:own": ["*"]
        },
        store: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        feed: {
            "read:any": ["*"]
        },
        address: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"],
            "delete:own": ["*"]
        }
    },
    courier: {
        profile: {
            "create:own": ["*"],
            "read:own": ["*"],
            "update:own": ["*"]
        },
        order: {
            "read:any": ["*"],
            "update:any": ["*"]
        },
        store: {
            "read:any": ["*"]
        },
        feed: {
            "read:any": ["*"]
        }
    },
    admin: {
        profile: {
            "create:any": ["*"],
            "read:any": ["*"],
            "update:any": ["*"]
        },
        order: {
            "create:any": ["*"],
            "read:any": ["*"],
        },
        menu: {
            "read:any": ["*"],
        },
        store: {
            "read:any": ["*"],
            "update:any": ["*"]
        },
        feed: {
            "read:any": ["*"],
            "create:own": ["*"],
            "update:any": ["*"]
        }
    }
};

const ac = new AccessControl(grants);

module.exports = ac;