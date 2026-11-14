# 🌱 ZeroWaste Connect

**ZeroWaste Connect** is a full-stack food redistribution platform connecting **restaurants with surplus food** to **NGOs serving communities in need**.

Restaurants list surplus food with location and shelf-life details, NGOs manage their capacity and requirements, and a hybrid matching engine—combining **rule-based constraints** with a **CatBoost ML microservice**—pairs donations with the best-suited NGO.

> **Turning surplus food into meaningful connections.**

---

##  Key Features

- **Role-Based JWT Auth:** Separate portals and role-protected endpoints for **Restaurants** and **NGOs** (`/auth/register`, `/auth/login`, `/auth/me`).
- **Surplus Food Management:** Restaurants list food with quantity, category, shelf life, expiry date, and GPS coordinates (via browser geolocation or OpenStreetMap Nominatim lookup).
- **NGO Matching Profiles & Requests:** NGOs configure capacity, current demand, category preferences, and GPS location, and submit donation requests (`/requests`).
- **Hybrid Smart Matching:** Filters NGOs by available capacity (`capacity - currentDemand >= quantity`), then ranks candidates using **70% CatBoost ML match probability + 30% rule-based heuristic score** (capacity, demand, category, Haversine distance), with automatic fallback to heuristics if the ML service is offline.
- **Public Analytics Dashboard:** Real-time KPIs and **Chart.js** visualizations tracking recovery rates, category breakdowns, match quality scores, and supply vs. demand.

---

##  Architecture & Tech Stack

React 18 + Vite (5173) ──▶ Spring Boot 3 API (8081) ──▶ PostgreSQL (zerowaste_db)
                                    │
                                    ▼
                         FastAPI + CatBoost (8000)



##  Machine Learning Service

The `ml-service` exposes `POST /predict-match` using a `CatBoostClassifier` trained on 50,000 synthetic restaurant–NGO pairs (`train.py`) across **15 features** (`quantity`, `category`, `shelf_life_hours`, `hours_until_expiry`, `urgency_score`, `capacity`, `current_demand`, `available_capacity`, `category_preference`, `distance_km`, `category_match`, `quantity_capacity_ratio`, `demand_coverage_ratio`, `capacity_fit_score`, `demand_score`).

### Example ML Request

```json
{
  "food": {
    "quantity": 28,
    "category": "Baked Goods",
    "shelf_life_hours": 12,
    "hours_until_expiry": 8.0,
    "urgency_score": 0.33,
    "latitude": 18.5204,
    "longitude": 73.8567
  },
  "ngo": {
    "capacity": 156,
    "current_demand": 153,
    "category_preference": "Prepared Meals",
    "latitude": 18.5500,
    "longitude": 18.8700
  }
}

```

### Example ML Response

```json
{
  "match_probability": 0.4353,
  "match_prediction": 0
}

```

> **Note:** Trained on synthetic data for demonstration purposes.

---

##  Getting Started

### Prerequisites

Java 21 • Node.js & npm • Python 3 • PostgreSQL

### 1. Database Setup

Create a PostgreSQL database named `zerowaste_db` and verify `ZeroWaste_backend/src/main/resources/application.properties`:

```properties
server.port=8081
spring.datasource.url=jdbc:postgresql://localhost:5432/zerowaste_db
spring.datasource.username=USERNAME
spring.datasource.password=PASSWORD

```

### 2. Run Backend (`http://localhost:8081`)

```bash
cd ZeroWaste_backend
./mvnw spring-boot:run   # Windows: mvnw.cmd spring-boot:run

```

Swagger UI: `http://localhost:8081/swagger-ui/index.html`

### 3. Run ML Service (`http://localhost:8000`)

```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python train.py           # Generates zerowaste_match_model.pkl if missing
uvicorn app:app --reload --port 8000

```

API Docs: `http://localhost:8000/docs`

### 4. Run Frontend (`http://localhost:5173`)

```bash
cd ZeroWaste_frontend
npm i
npm run dev
```
