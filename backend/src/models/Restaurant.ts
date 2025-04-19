export interface Restaurant {
  id: number
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  cuisineType: string
  priceRange: number // 1-4 representing $ to $$$$
  rating: number // 1-5
  imageUrl: string
  phone: string
  website: string
  openingHours: string
}

export interface RestaurantSearchParams {
  latitude: number
  longitude: number
  radius?: number // in kilometers
  cuisineType?: string
  priceRange?: number
}
