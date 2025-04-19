"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { Picker } from "@react-native-picker/picker"
import type { RootStackParamList } from "../App"
import { useRestaurants } from "../context/RestaurantContext"
import RestaurantCard from "../components/RestaurantCard"

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">

const cuisineTypes = [
  "All",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "American",
  "Thai",
  "Mediterranean",
  "French",
]

const priceRanges = [
  { label: "All", value: 0 },
  { label: "$", value: 1 },
  { label: "$$", value: 2 },
  { label: "$$$", value: 3 },
  { label: "$$$$", value: 4 },
]

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>()
  const { restaurants, loading, error, searchRestaurants } = useRestaurants()

  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All")
  const [selectedPriceRange, setSelectedPriceRange] = useState<number>(0)
  const [mapView, setMapView] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== "granted") {
          setLocationError("Permission to access location was denied")
          return
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({})
        setLocation(currentLocation)

        // Search for nearby restaurants
        await searchRestaurants(currentLocation.coords.latitude, currentLocation.coords.longitude)
      } catch (err) {
        setLocationError("Failed to get location")
        console.error("Error getting location:", err)
      }
    })()
  }, [])

  const applyFilters = async () => {
    if (!location) return

    const filters: { cuisineType?: string; priceRange?: number } = {}

    if (selectedCuisine !== "All") {
      filters.cuisineType = selectedCuisine
    }

    if (selectedPriceRange > 0) {
      filters.priceRange = selectedPriceRange
    }

    await searchRestaurants(location.coords.latitude, location.coords.longitude, filters)
  }

  const navigateToDetail = (restaurantId: number) => {
    navigation.navigate("RestaurantDetail", { restaurantId })
  }

  if (locationError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{locationError}</Text>
        <Text>Please enable location services to use this app.</Text>
      </View>
    )
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Cuisine:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCuisine}
              onValueChange={(value) => setSelectedCuisine(value)}
              style={styles.picker}
            >
              {cuisineTypes.map((cuisine) => (
                <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Price:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPriceRange}
              onValueChange={(value) => setSelectedPriceRange(value)}
              style={styles.picker}
            >
              {priceRanges.map((range) => (
                <Picker.Item key={range.value} label={range.label} value={range.value} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !mapView && styles.activeToggle]}
          onPress={() => setMapView(false)}
        >
          <Text style={[styles.toggleText, !mapView && styles.activeToggleText]}>List View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, mapView && styles.activeToggle]}
          onPress={() => setMapView(true)}
        >
          <Text style={[styles.toggleText, mapView && styles.activeToggleText]}>Map View</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#f4511e" />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Map View */}
      {mapView ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />

          {/* Restaurant Markers */}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`${restaurant.cuisineType} • ${Array(restaurant.priceRange).fill("$").join("")}`}
              onCalloutPress={() => navigateToDetail(restaurant.id)}
            />
          ))}
        </MapView>
      ) : (
        /* List View */
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RestaurantCard restaurant={item} onPress={() => navigateToDetail(item.id)} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No restaurants found nearby.</Text>
                <Text>Try adjusting your filters or search in a different area.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  filterContainer: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterLabel: {
    width: 70,
    fontSize: 16,
    fontWeight: "500",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  picker: {
    height: 40,
  },
  applyButton: {
    backgroundColor: "#f4511e",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  viewToggleContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  activeToggle: {
    borderBottomWidth: 2,
    borderBottomColor: "#f4511e",
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleText: {
    color: "#f4511e",
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#ffeeee",
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  errorText: {
    color: "#d32f2f",
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
})

export default HomeScreen
