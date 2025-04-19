import type { Request, Response } from "express"
import * as restaurantService from "../services/restaurantService"
import type { RestaurantSearchParams } from "../models/Restaurant"

export const getAllRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await restaurantService.getRestaurants()
    res.json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    res.status(500).json({ error: "Failed to fetch restaurants" })
  }
}

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid restaurant ID" })
    }

    const restaurant = await restaurantService.getRestaurantById(id)

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    res.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    res.status(500).json({ error: "Failed to fetch restaurant" })
  }
}

export const searchNearbyRestaurants = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius, cuisineType, priceRange } = req.query

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    const searchParams: RestaurantSearchParams = {
      latitude: Number.parseFloat(latitude as string),
      longitude: Number.parseFloat(longitude as string),
    }

    // Add optional parameters if provided
    if (radius) {
      searchParams.radius = Number.parseFloat(radius as string)
    }

    if (cuisineType) {
      searchParams.cuisineType = cuisineType as string
    }

    if (priceRange) {
      searchParams.priceRange = Number.parseInt(priceRange as string)
    }

    const restaurants = await restaurantService.searchRestaurants(searchParams)
    res.json(restaurants)
  } catch (error) {
    console.error("Error searching restaurants:", error)
    res.status(500).json({ error: "Failed to search restaurants" })
  }
}
