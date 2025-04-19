CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  cuisine_type VARCHAR(100) NOT NULL,
  price_range INTEGER NOT NULL CHECK (price_range BETWEEN 1 AND 4),
  rating DECIMAL(2, 1) CHECK (rating BETWEEN 1 AND 5),
  image_url TEXT,
  phone VARCHAR(20),
  website TEXT,
  opening_hours TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants USING gist (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);

-- Index for cuisine type filtering
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine_type);

-- Index for price range filtering
CREATE INDEX IF NOT EXISTS idx_restaurants_price ON restaurants(price_range);
