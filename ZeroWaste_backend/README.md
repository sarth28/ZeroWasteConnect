# ZeroWaste Connect

## Overview
ZeroWaste Connect is a Spring Boot web application that helps reduce food waste by connecting restaurants with NGOs. Restaurants can list surplus food, and the system automatically matches it with suitable NGOs based on predefined criteria.

## Features
- Restaurant Management (CRUD)
- NGO Management (CRUD)
- Food Listing Management (CRUD)
- Automatic Food-NGO Matching
- Analytics Dashboard
- RESTful APIs
- PostgreSQL Database
- Swagger API Documentation

## Tech Stack
- Java 21
- Spring Boot 3
- Spring Data JPA
- PostgreSQL
- Maven
- Swagger (OpenAPI)

## Project Structure

```
src/main/java
├── controller
├── service
├── repository
├── entity
└── dto
```

## API Endpoints

### Restaurants
- GET /restaurants
- POST /restaurants
- PUT /restaurants/{id}
- DELETE /restaurants/{id}

### NGOs
- GET /ngos
- POST /ngos
- PUT /ngos/{id}
- DELETE /ngos/{id}

### Food Listings
- GET /food
- POST /food
- PUT /food/{id}
- DELETE /food/{id}

### Matching
- GET /matches
- POST /matches
- POST /matches/match-food/{foodId}

### Analytics
- GET /analytics

## Database
- PostgreSQL

## Running the Project

1. Clone the repository
2. Configure PostgreSQL in `application.properties`
3. Run the application
4. Open Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

## Author

Hemant Murkute
Sarth Nagnath
Venketesh Gophane
