"use client"

import { useEffect } from "react"
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from "react-native"
import { useRoute, type RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../App"
import { useRestaurants } from "../context/RestaurantContext"
import { MaterialIcons, FontAwesome } from "@expo/vector-icons"

type RestaurantDetailScreenRouteProp = RouteProp<RootStackParamList, "RestaurantDetail">

const RestaurantDetailScreen = () => {
  const route = useRoute<RestaurantDetailScreenRouteProp>()
  const { restaurantId } = route.params
  const { selectedRestaurant, loading, error, getRestaurantById } = useRestaurants()

  useEffect(() => {
    getRestaurantById(restaurantId)
  }, [restaurantId])

  const handleOpenMap = () => {
    if (!selectedRestaurant) return

    const { latitude, longitude, name } = selectedRestaurant
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${name}`

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        }
      })
      .catch((err) => console.error("Error opening map:", err))
  }

  const handleCall = () => {
    if (!selectedRestaurant?.phone) return

    const url = `tel:${selectedRestaurant.phone}`

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url)
        }
      })
      .catch((err) => console.error("Error making call:", err))
  }

  const handleOpenWebsite = () => {
    if (!selectedRestaurant?.website) return

    Linking.canOpenURL(selectedRestaurant.website)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(selectedRestaurant.website)
        }
      })
      .catch((err) => console.error("Error opening website:", err))
  }

  const renderRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={`full-${i}`} name="star" size={18} color="#f4511e" />)
    }

    if (halfStar) {
      stars.push(<FontAwesome key="half" name="star-half-o" size={18} color="#f4511e" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesome key={`empty-${i}`} name="star-o" size={18} color="#f4511e" />)
    }

    return stars
  }

  const renderPriceRange = (priceRange: number) => {
    return Array(priceRange).fill("$").join("")
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!selectedRestaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: selectedRestaurant.imageUrl || "https://via.placeholder.com/400x200?text=Restaurant" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{selectedRestaurant.name}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>{renderRatingStars(selectedRestaurant.rating)}</View>
          <Text style={styles.priceRange}>{renderPriceRange(selectedRestaurant.priceRange)}</Text>
          <Text style={styles.cuisineType}>{selectedRestaurant.cuisineType}</Text>
        </View>

        <Text style={styles.description}>{selectedRestaurant.description}</Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={24} color="#f4511e" />
            <Text style={styles.infoText}>{selectedRestaurant.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={24} color="#f4511e" />
            <Text style={styles.infoText}>{selectedRestaurant.openingHours}</Text>
          </View>

          {selectedRestaurant.phone && (
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={24} color="#f4511e" />
              <Text style={styles.infoText}>{selectedRestaurant.phone}</Text>
            </View>
          )}

          {selectedRestaurant.website && (
            <View style={styles.infoRow}>
              <MaterialIcons name="language" size={24} color="#f4511e" />
              <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                {selectedRestaurant.website}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleOpenMap}>
            <MaterialIcons name="directions" size={24} color="white" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>

          {selectedRestaurant.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <MaterialIcons name="call" size={24} color="white" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}

          {selectedRestaurant.website && (
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenWebsite}>
              <MaterialIcons name="public" size={24} color="white" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
  },
  detailsContainer: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: "row",
    marginRight: 10,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginRight: 10,
  },
  cuisineType: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#f4511e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#d32f2f",
    textAlign: "center",
  },
})

export default RestaurantDetailScreen
