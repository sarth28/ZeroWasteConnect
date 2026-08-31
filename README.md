# ZeroWaste Connect ♻️

ZeroWaste Connect is a food-waste management platform designed to connect restaurants with NGOs that can receive and distribute surplus food.

The project combines a **React frontend**, **Spring Boot backend**, **PostgreSQL database**, and a separate **Python/FastAPI machine-learning service** for intelligent food–NGO matching.

---

## 🎯 Objective

A significant amount of edible food is wasted by restaurants despite nearby organizations having a demand for food.

ZeroWaste Connect aims to reduce this gap by providing a platform where:

* Restaurants can register and manage surplus food listings.
* NGOs can register their requirements and available capacity.
* Food listings can be matched with suitable NGOs.
* Geographic distance can be considered during matching.
* Food urgency and NGO demand can be considered.
* A machine-learning model can estimate the probability that a food–NGO pair is a successful match.

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │   Vite + Bootstrap  │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │       Java 21       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌──────────────┐
       │ PostgreSQL │   │ Matching   │   │ ML Service   │
       │  Database  │   │   Logic    │   │ FastAPI      │
       └────────────┘   └────────────┘   └──────┬───────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │ CatBoost Model  │
                                        │ Match Predictor │
                                        └─────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* Axios
* Bootstrap 5
* JavaScript

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Maven
* REST APIs
* SpringDoc / OpenAPI

### Database

* PostgreSQL

### Machine Learning

* Python
* FastAPI
* Pandas
* NumPy
* CatBoost
* Scikit-learn
* Pickle

---

## 📂 Project Structure

```text
ZeroWaste-Connect/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/
│   │   │           └── zerowaste/
│   │   └── resources/
│   ├── pom.xml
│   └── ...
│
├── ml/
│   ├── notebook/
│   │   └── model_training.ipynb
│   ├── api/
│   │   ├── main.py
│   │   └── requirements.txt
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact directory names may differ depending on the current development setup.

---

# 👥 Core Entities

## Restaurant

Restaurants represent food donors on the platform.

Current fields include:

```text
id
name
location
contactNumber
```

---

## NGO

NGOs represent organizations that can receive surplus food.

Current fields include:

```text
id
name
location
capacity
currentDemand
categoryPreference
latitude
longitude
```

---

## Food Listing

A food listing represents surplus food made available by a restaurant.

Current information includes:

```text
id
foodName
quantity
expiryDate
category
shelfLifeHours
restaurantId
latitude
longitude
```

---

## Match Record

Match records represent food–NGO matching results.

The matching system can use:

* Food category
* NGO category preference
* Food quantity
* NGO capacity
* NGO current demand
* Geographic distance
* Food shelf life
* Time remaining until expiry

---

# 🤖 Machine Learning Component

The project contains a separate ML service for predicting whether a particular food listing and NGO are likely to form a successful match.

The model is trained using **synthetic data** designed to represent realistic food donation and NGO matching scenarios.

### Model

Current model:

```text
CatBoostClassifier
```

### Target

```text
match_success
```

where:

```text
0 = Unsuccessful / unlikely match
1 = Successful / likely match
```

The ML service returns:

```json
{
  "match_probability": 0.88,
  "match_prediction": 1
}
```

---

## 🧠 ML Features

The current model uses 15 features:

```text
quantity
category
shelf_life_hours
hours_until_expiry
urgency_score
capacity
current_demand
available_capacity
category_preference
distance_km
category_match
quantity_capacity_ratio
demand_coverage_ratio
capacity_fit_score
demand_score
```

Two categorical features are currently used:

```text
category
category_preference
```

### Derived Features

The model also calculates useful matching features such as:

#### Distance

Distance between the restaurant and NGO is calculated using the Haversine formula.

```text
distance_km
```

#### Category Match

```text
category_match = 1
```

when the NGO accepts the food category or has an `Any` preference.

Otherwise:

```text
category_match = 0
```

#### Available Capacity

```text
available_capacity =
    capacity - current_demand
```

---

# 📊 Current ML Performance

The current CatBoost model was evaluated using a synthetic dataset.

Current test results:

```text
Accuracy  : 0.6587
Precision : 0.6612
Recall    : 0.5930
F1 Score  : 0.6252
ROC-AUC   : 0.7097
```

Confusion matrix:

```text
[[3740 1459]
 [1954 2847]]
```

These results are based on synthetic data and should therefore not be interpreted as real-world performance.

The ML component is intended primarily as a demonstration of how intelligent matching can be integrated into the ZeroWaste Connect platform.

---

# 🔌 ML API

The ML model is exposed through a FastAPI service.

## Health Check

```http
GET /
```

Example response:

```json
{
  "message": "ZeroWaste Connect ML Service is running",
  "status": "OK",
  "model": "CatBoostClassifier",
  "model_version": "1.0"
}
```

---

## Predict Match

```http
POST /predict-match
```

Example request:

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
    "longitude": 73.8700
  }
}
```

Example response:

```json
{
  "match_probability": 0.4353,
  "match_prediction": 0
}
```

---

# 🌐 Backend API

The Spring Boot backend currently exposes REST endpoints for the major entities.

### Restaurants

```text
GET    /restaurants
GET    /restaurants/{id}
POST   /restaurants
PUT    /restaurants/{id}
DELETE /restaurants/{id}
```

### NGOs

```text
GET    /ngos
GET    /ngos/{id}
POST   /ngos
PUT    /ngos/{id}
DELETE /ngos/{id}
```

### Food Listings

```text
GET    /food
GET    /food/{id}
POST   /food
PUT    /food/{id}
DELETE /food/{id}
```

### Matching

```text
GET  /matches
POST /matches
POST /matches/match-food/{foodId}
```

### Analytics

```text
GET /analytics
```

### Machine Learning

```text
POST /ml/predict-match
```

---

# 📖 API Documentation

When the Spring Boot backend is running, Swagger/OpenAPI documentation is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

The ML service also provides FastAPI's interactive API documentation at:

```text
http://localhost:8000/docs
```

---

# ⚙️ Running the Project

## 1. PostgreSQL

Create a PostgreSQL database and configure the Spring Boot database connection.

Do **not** commit database passwords or other credentials to GitHub.

Use environment variables or a local configuration file.

---

## 2. Start the Spring Boot Backend

From the backend directory:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend runs by default on:

```text
http://localhost:8080
```

---

## 3. Start the ML Service

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it.

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The ML service runs by default on:

```text
http://localhost:8000
```

---

## 4. Start the Frontend

From the frontend directory:

```bash
npm install
```

Then:

```bash
npm run dev
```

Vite will provide the local frontend URL.

---

# 🔐 Environment Variables

Sensitive configuration should not be committed.

For example:

```env
DB_URL=jdbc:postgresql://localhost:5432/zerowaste
DB_USERNAME=your_username
DB_PASSWORD=your_password
ML_SERVICE_URL=http://localhost:8000
```

A `.env.example` or equivalent configuration template should be committed instead of the actual credentials.

---

# 🚧 Current Development Status

### Completed / In Progress

* [x] React frontend setup
* [x] Spring Boot backend
* [x] PostgreSQL integration
* [x] Restaurant CRUD
* [x] NGO CRUD
* [x] Food listing CRUD
* [x] Matching endpoints
* [x] Analytics endpoint
* [x] Synthetic ML dataset
* [x] CatBoost match prediction model
* [x] Model evaluation
* [x] Model serialization
* [x] FastAPI ML service
* [x] Spring Boot → FastAPI integration
* [ ] Complete ML-powered automatic matching workflow
* [ ] Frontend integration of ML predictions
* [ ] Final end-to-end testing
* [ ] Production deployment

---

# ⚠️ Dataset and Model Disclaimer

The current machine-learning model is trained on **synthetically generated data**.

The synthetic dataset is intended for:

* Development
* Demonstration
* Model integration
* Testing
* Academic/project evaluation

It does not represent actual food donation behavior or real-world NGO demand.

Real-world deployment would require collecting and validating historical food donation and matching data.

---

# 🔮 Future Improvements

Potential future improvements include:

* Real historical matching data
* Improved match-ranking algorithms
* Real-time NGO availability
* More accurate demand prediction
* Route and delivery optimization
* Expiry-aware prioritization
* Notification system
* Authentication and authorization
* Restaurant and NGO dashboards
* Deployment using Docker
* Cloud deployment
* Model monitoring and retraining

---

# 👨‍💻 Project

**ZeroWaste Connect**

A full-stack food-waste management and intelligent matching platform.

Built using:

```text
React
Spring Boot
PostgreSQL
Python
FastAPI
CatBoost
```
