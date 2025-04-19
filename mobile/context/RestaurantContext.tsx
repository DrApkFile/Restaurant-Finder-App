"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode } from "react"
import type { Restaurant } from "../types/Restaurant"
import { fetchNearbyRestaurants, fetchRestaurantById } from "../services/api"

interface RestaurantContextType {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  selectedRestaurant: Restaurant | null
  searchRestaurants: (
    latitude: number,
    longitude: number,
    filters?: { cuisineType?: string; priceRange?: number },
  ) => Promise<void>
  getRestaurantById: (id: number) => Promise<void>
  clearSelectedRestaurant: () => void
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const searchRestaurants = async (
    latitude: number,
    longitude: number,
    filters?: { cuisineType?: string; priceRange?: number },
  ) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchNearbyRestaurants(latitude, longitude, filters)
      setRestaurants(data)
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again.")
      console.error("Error fetching restaurants:", err)
    } finally {
      setLoading(false)
    }
  }

  const getRestaurantById = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchRestaurantById(id)
      setSelectedRestaurant(data)
    } catch (err) {
      setError("Failed to fetch restaurant details. Please try again.")
      console.error("Error fetching restaurant details:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearSelectedRestaurant = () => {
    setSelectedRestaurant(null)
  }

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        loading,
        error,
        selectedRestaurant,
        searchRestaurants,
        getRestaurantById,
        clearSelectedRestaurant,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export const useRestaurants = () => {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error("useRestaurants must be used within a RestaurantProvider")
  }
  return context
}
