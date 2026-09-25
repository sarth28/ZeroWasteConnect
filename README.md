# 🌱 ZeroWaste Connect

**ZeroWaste Connect** is a full-stack platform that helps reduce food waste by connecting **restaurants with surplus food** to **NGOs that can distribute it to people in need**.

Restaurants can list their surplus food, while NGOs can discover available food and participate in the matching process. The platform also provides analytics and a machine-learning service that predicts how suitable a food–NGO combination is for a successful match.

> **Turning surplus food into meaningful connections.**

---

##  Why ZeroWaste Connect?

A large amount of edible food is discarded every day while organizations serving communities may struggle to meet demand.

The problem is not always the lack of food — it is often the lack of an efficient way to connect:

**Surplus food → Suitable NGO → Timely redistribution**

ZeroWaste Connect aims to make this process more organized by providing a centralized platform for food listings, NGO requirements, matching, and analytics.

---

##  Features

###  Role-Based Accounts

The platform supports two types of users:

* **Restaurants** — list and manage surplus food
* **NGOs** — view available food and participate in matching

Users can register and log in through the platform, with access to functionality based on their role.

###  Food Listings

Restaurants can create surplus-food listings containing information such as:

* Food name
* Quantity
* Category
* Expiry date
* Shelf life
* Location

This allows available food to be represented in a structured format that can be used by the matching system.

### 🤝 Food–NGO Matching

The platform can automatically match a food listing with a suitable NGO using factors such as:

* NGO capacity
* Current demand
* Food category
* Distance
* Available capacity

###  Machine Learning Match Prediction

ZeroWaste Connect also includes a machine-learning service that evaluates a **food–NGO pair** and predicts the probability of a successful match.

The ML model uses information such as:

* Food quantity and category
* Shelf life and time until expiry
* NGO capacity and current demand
* Distance between the food and NGO
* Category compatibility
* Capacity and demand-related features

The ML service is currently trained using **synthetic data**, so its predictions are intended as a demonstration of the ML integration rather than production-ready predictions.

###  Analytics

The platform provides visual analytics for information such as:

* Food distribution by category
* Matching statistics
* Restaurant and NGO activity
* Supply and demand information

These visualizations help provide an overview of the platform's food redistribution activity.

---

##  How It Works

```text
┌──────────────┐
│  Restaurant  │
└──────┬───────┘
       │
       │ Lists surplus food
       ▼
┌────────────────────┐
│   Food Listing     │
└─────────┬──────────┘
          │
          │ Matching
          ▼
┌────────────────────┐
│  Matching System   │
│                    │
│ Capacity           │
│ Demand             │
│ Category           │
│ Distance           │
└─────────┬──────────┘
          │
          │ Suitable NGO
          ▼
┌──────────────┐
│     NGO      │
└──────┬───────┘
       │
       ▼
 Food Redistribution
```

The application consists of a React frontend, a Spring Boot backend, a PostgreSQL database, and a separate Python ML service.

---

##  Machine Learning

The ML component uses **CatBoost** to predict whether a food listing and an NGO are likely to result in a successful match.

### Model Input

The model considers 15 features:

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

The categorical features are:

```text
category
category_preference
```

### Example ML Request

For reference, the ML service accepts a request in the following format:

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

An example response is:

```json
{
  "match_probability": 0.4353,
  "match_prediction": 0
}
```

Here, `match_probability` represents the model's predicted probability for a successful match, while `match_prediction` represents the resulting binary prediction.

> **Note:** The model was trained on synthetic data created for this project. The example prediction should therefore not be interpreted as a real-world assessment of an NGO or food listing.

---

## Technology Stack

### Frontend

* React 18
* Vite
* Bootstrap 5
* Axios
* React Router
* Chart.js

### Backend

* Java 21
* Spring Boot 3
* Spring Data JPA
* Spring Security
* JWT
* PostgreSQL
* Springdoc OpenAPI / Swagger

### Machine Learning

* Python
* FastAPI
* CatBoost
* Pandas
* NumPy
* Scikit-learn

---

##  Architecture

```text
                    ┌──────────────────────┐
                    │     React Frontend   │
                    │                      │
                    │  Login / Dashboard   │
                    │  Food Listings       │
                    │  Matching / Analytics│
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot API   │
                    │                      │
                    │ Authentication       │
                    │ CRUD Operations      │
                    │ Matching             │
                    │ Analytics            │
                    └───────┬───────┬──────┘
                            │       │
                            ▼       ▼
                    ┌──────────┐  ┌────────────────┐
                    │PostgreSQL│  │  FastAPI ML    │
                    │ Database │  │    Service     │
                    └──────────┘  └───────┬────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │   CatBoost  │
                                   │    Model    │
                                   └─────────────┘
```

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

* **Java 21**
* **Node.js and npm**
* **Python 3**
* **PostgreSQL**
* **Git**

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ZeroWaste-Connect
```

---

### 2. Configure PostgreSQL

Create a PostgreSQL database for the application.

Then configure the database connection in:

```text
ZeroWaste_backend/src/main/resources/application.properties
```

---

### 3. Start the Backend

Navigate to the backend:

```bash
cd ZeroWaste_backend
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

### 4. Start the ML Service

Navigate to:

```bash
cd ml-service
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

If the trained model is not already present, train it using:

```bash
python train.py
```

Then start the FastAPI service:

```bash
uvicorn app:app --reload
```

The ML service will run on:

```text
http://localhost:8000
```

API documentation is available at:

```text
http://localhost:8000/docs
```

---

### 5. Start the Frontend

Navigate to:

```bash
cd ZeroWaste_frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Project Structure

```text
ZeroWaste-Connect/
│
├── ZeroWaste_frontend/       # React frontend
│
├── ZeroWaste_backend/        # Spring Boot backend
│
├── ml-service/               # FastAPI + CatBoost ML service
│   ├── app.py
│   ├── train.py
│   ├── requirements.txt
│   └── zerowaste_match_model.pkl
│
└── README.md
```

---

##  Project Status

The project currently includes:

* Restaurant and NGO registration
* Login and role-based access
* Food listing management
* NGO and restaurant management
* Automated rule-based matching
* Analytics dashboard
* Machine-learning match prediction
* FastAPI ML service
* Spring Boot ↔ ML service integration

The ML prediction component is currently maintained as a separate prediction service and is not yet the primary mechanism used by the automatic matching workflow.

---

##  Future Scope

* Training the model using real historical matching data
* Combining rule-based matching with ML predictions
* Real-time notifications for restaurants and NGOs
* Delivery and route optimization
* Expiry-aware prioritization
* Cloud deployment
* Docker-based deployment
* Continuous model monitoring and retraining

---

## 🌱 Our Goal

ZeroWaste Connect aims to make food redistribution more organized by using technology to connect **surplus food with organizations that can put it to use**.

**Less waste. Better connections. More food reaching people who need it.**
