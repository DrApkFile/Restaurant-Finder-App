import type { Restaurant } from "../types/Restaurant"
import Constants from "expo-constants"

// Get the API URL from environment variables or use a default
const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api"

export const fetchNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  filters?: { cuisineType?: string; priceRange?: number },
): Promise<Restaurant[]> => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    })

    // Add optional filters if provided
    if (filters?.cuisineType) {
      params.append("cuisineType", filters.cuisineType)
    }

    if (filters?.priceRange) {
      params.append("priceRange", filters.priceRange.toString())
    }

    // Make the API request
    const response = await fetch(`${API_URL}/restaurants/search/nearby?${params}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching nearby restaurants:", error)
    throw error
  }
}

export const fetchRestaurantById = async (id: number): Promise<Restaurant> => {
  try {
    const response = await fetch(`${API_URL}/restaurants/${id}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching restaurant with id ${id}:`, error)
    throw error
  }
}
