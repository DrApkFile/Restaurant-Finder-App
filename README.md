# Restaurant Finder Application

A location-based restaurant discovery application built with React Native Expo for the frontend and Express.js for the backend.

## Features

- Mobile interface showing nearby restaurants
- Geolocation-based search functionality
- Filtering options by cuisine type and price range
- Restaurant detail view with basic information
- Backend API to serve restaurant data and handle search queries

## Tech Stack

- **Frontend**: React Native Expo
- **Backend**: Express.js
- **Database**: PostgreSQL
- **Infrastructure**: Docker

## Project Structure

\`\`\`
restaurant-finder/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── db/              # Database connection and schema
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── Dockerfile           # Backend Docker configuration
│   └── package.json         # Backend dependencies
├── mobile/                  # React Native Expo app
│   ├── assets/              # Images and assets
│   ├── components/          # Reusable UI components
│   ├── context/             # React Context for state management
│   ├── screens/             # App screens
│   ├── services/            # API client and services
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main app component
│   └── package.json         # Mobile dependencies
└── docker-compose.yml       # Docker Compose configuration
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- Expo CLI (`npm install -g expo-cli`)

### Backend Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/DrApkFile/Restaurant-FinderApp.git
   cd Restaurant-FinderApp
   \`\`\`

2. Start the backend services using Docker Compose:
   \`\`\`bash
   docker-compose up -d
   \`\`\`

   This will start both the PostgreSQL database and the Express.js API.

3. The API will be available at `http://localhost:3000`.

### Mobile App Setup

1. Navigate to the mobile directory:
   \`\`\`bash
   cd mobile
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Update the API URL in `app.json` if needed:
   \`\`\`json
   "extra": {
     "apiUrl": "http://YOUR_LOCAL_IP:3000/api"
   }
   \`\`\`

   Replace `YOUR_LOCAL_IP` with your machine's IP address to allow the mobile app to connect to the API when running on a physical device.

4. Start the Expo development server:
   \`\`\`bash
   npm start
   \`\`\`

5. Use the Expo Go app on your mobile device to scan the QR code, or press 'a' to open in an Android emulator or 'i' for iOS simulator.

## Architectural Decisions

### Backend

- **Express.js**: Chosen for its simplicity, flexibility, and wide adoption in the Node.js ecosystem.
- **PostgreSQL with PostGIS**: Used for efficient geospatial queries to find nearby restaurants.
- **Service Layer Pattern**: Separates business logic from controllers for better maintainability.
- **Repository Pattern**: Abstracts database operations for easier testing and potential database changes.

### Mobile App

- **React Native Expo**: Provides a quick development experience with pre-configured native components.
- **Context API**: Used for state management to avoid prop drilling and maintain a clean component hierarchy.
- **React Navigation**: Handles screen navigation with a native stack navigator for smooth transitions.
- **Component-Based Architecture**: Reusable UI components for consistency across the app.

## Future Improvements

With more time, the following improvements could be made:

1. **Authentication**: Add user accounts with authentication to save favorite restaurants.
2. **Reviews and Ratings**: Allow users to leave reviews and ratings for restaurants.
3. **Advanced Filtering**: Add more filtering options like distance, ratings, and open now.
4. **Caching**: Implement client-side caching to reduce API calls and improve performance.
5. **Offline Support**: Add offline capabilities to view previously loaded restaurants.
6. **Testing**: Add comprehensive unit and integration tests for both frontend and backend.
7. **CI/CD Pipeline**: Set up continuous integration and deployment for automated testing and deployment.
8. **Performance Optimization**: Optimize database queries and implement pagination for large result sets.
9. **Analytics**: Add analytics to track user behavior and improve the app experience.
10. **Accessibility**: Ensure the app is accessible to all users, including those with disabilities.

## License

MIT

