import express from "express"
import * as restaurantController from "../controllers/restaurantController"

const router = express.Router()

// Get all restaurants
router.get("/", restaurantController.getAllRestaurants)

// Get a specific restaurant by ID
router.get("/:id", restaurantController.getRestaurant)

// Search for nearby restaurants
router.get("/search/nearby", restaurantController.searchNearbyRestaurants)

export default router
