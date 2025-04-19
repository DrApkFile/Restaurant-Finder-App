import pool from "../db"
import type { Restaurant, RestaurantSearchParams } from "../models/Restaurant"

export const getRestaurants = async (): Promise<Restaurant[]> => {
  const query = "SELECT * FROM restaurants"
  const { rows } = await pool.query(query)
  return rows.map(mapRestaurantFromDb)
}

export const getRestaurantById = async (id: number): Promise<Restaurant | null> => {
  const query = "SELECT * FROM restaurants WHERE id = $1"
  const { rows } = await pool.query(query, [id])

  if (rows.length === 0) {
    return null
  }

  return mapRestaurantFromDb(rows[0])
}

export const searchRestaurants = async (params: RestaurantSearchParams): Promise<Restaurant[]> => {
  const { latitude, longitude, radius = 5, cuisineType, priceRange } = params

  // Base query with distance calculation
  let query = `
    SELECT *, 
    ST_Distance(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
      ST_SetSRID(ST_MakePoint($1, $2), 4326)
    ) * 111.32 AS distance
    FROM restaurants
    WHERE ST_Distance(
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
      ST_SetSRID(ST_MakePoint($1, $2), 4326)
    ) * 111.32 <= $3
  `

  const queryParams: any[] = [longitude, latitude, radius]

  // Add cuisine type filter if provided
  if (cuisineType) {
    query += ` AND cuisine_type = $${queryParams.length + 1}`
    queryParams.push(cuisineType)
  }

  // Add price range filter if provided
  if (priceRange) {
    query += ` AND price_range = $${queryParams.length + 1}`
    queryParams.push(priceRange)
  }

  // Order by distance
  query += " ORDER BY distance"

  const { rows } = await pool.query(query, queryParams)
  return rows.map(mapRestaurantFromDb)
}

// Helper function to map database row to Restaurant model
const mapRestaurantFromDb = (row: any): Restaurant => {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    address: row.address,
    latitude: Number.parseFloat(row.latitude),
    longitude: Number.parseFloat(row.longitude),
    cuisineType: row.cuisine_type,
    priceRange: row.price_range,
    rating: Number.parseFloat(row.rating),
    imageUrl: row.image_url,
    phone: row.phone,
    website: row.website,
    openingHours: row.opening_hours,
  }
}
