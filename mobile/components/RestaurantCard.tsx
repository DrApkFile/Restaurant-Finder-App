import type React from "react"
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import type { Restaurant } from "../types/Restaurant"

interface RestaurantCardProps {
  restaurant: Restaurant
  onPress: () => void
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const renderRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={`full-${i}`} name="star" size={14} color="#f4511e" />)
    }

    if (halfStar) {
      stars.push(<FontAwesome key="half" name="star-half-o" size={14} color="#f4511e" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={14} color="#f4511e" />)
    }

    return stars
  }

  const renderPriceRange = (priceRange: number) => {
    return Array(priceRange).fill("$").join("")
  }

  const formatDistance = (distance?: number) => {
    if (!distance) return ""
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: restaurant.imageUrl || "https://via.placeholder.com/100x100?text=Restaurant" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {restaurant.name}
        </Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>{renderRatingStars(restaurant.rating)}</View>
          <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.cuisineType}>{restaurant.cuisineType}</Text>
          <Text style={styles.priceRange}>{renderPriceRange(restaurant.priceRange)}</Text>
          {restaurant.distance !== undefined && (
            <Text style={styles.distance}>{formatDistance(restaurant.distance)}</Text>
          )}
        </View>

        <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
          {restaurant.address}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingStars: {
    flexDirection: "row",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  detailsContainer: {
    flexDirection: "row",
    marginTop: 4,
    flexWrap: "wrap",
  },
  cuisineType: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
    marginRight: 6,
  },
  distance: {
    fontSize: 14,
    color: "#666",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
})

export default RestaurantCard
