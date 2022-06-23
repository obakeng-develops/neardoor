# Neardoor
The neardoor backend API for neardoor, the food-delivery app for low-density areas.

## Goal
The goal of this project was to learn MongoDB and NextJS. The project is a backend API containing multiple entities related to
food delivery - the consumer (handles customer orders), courier (handles couriers), feed (feed of all restaurants near a user),
merchant (their dashboard of transaction history, incoming/outgoing orders) and store (information about the merchant's store).

## Auth
The project also implements custom authentication through JWT (JSON Web Tokens). Token refreshes are also supported.

## Models 
### Courier
  - Courier (model a single courier)
  - Delivery (model delivering an order)
  - Fleet (model a fleet of vehicles relating to a courier)
  - Vehicle (model a single vehicle)

### Order
  - Order (model an order)
  - OrderItem (a single order item in an order)
  - Payment (model a user payment)
  - ScheduledOrder (model a scheduled order)
  - Tip (model a tip, paid by customer)

### Store
  - Discount (model a store discount)
  - FoodCategory
  - Menu (tabular display of all food items in the store)
  - MenuCategory
  - MenuItem (single menu item on a menu)
  - Store (a store relating to a merchant)
  - StoreAddress 
  - StoreCategory

### Tokens
  - Token (modeled tokens for authentication)
