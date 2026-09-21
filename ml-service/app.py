from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os
import math
import pandas as pd
import numpy as np


app = FastAPI(
    title="ZeroWaste Connect ML Service",
    description="ML service for food-NGO match prediction",
    version="1.0"
)


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

MODEL_PATH = "zerowaste_match_model.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )

with open(MODEL_PATH, "rb") as f:
    model_bundle = pickle.load(f)

model = model_bundle["model"]
feature_columns = model_bundle["feature_columns"]
categorical_features = model_bundle["categorical_features"]


# ==========================================
# REQUEST SCHEMA
# ==========================================

class FoodListing(BaseModel):
    quantity: int
    category: str
    shelf_life_hours: int
    hours_until_expiry: float
    urgency_score: float
    latitude: float
    longitude: float


class NGO(BaseModel):
    capacity: int
    current_demand: int
    category_preference: str
    latitude: float
    longitude: float


class MatchRequest(BaseModel):
    food: FoodListing
    ngo: NGO


# ==========================================
# HAVERSINE DISTANCE
# ==========================================

def haversine_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    R = 6371.0

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


# ==========================================
# FEATURE PREPARATION
# ==========================================

def prepare_features(food, ngo):

    quantity = food.quantity
    category = food.category

    shelf_life_hours = (
        food.shelf_life_hours
    )

    hours_until_expiry = (
        food.hours_until_expiry
    )

    urgency_score = (
        food.urgency_score
    )

    capacity = ngo.capacity

    current_demand = (
        ngo.current_demand
    )

    category_preference = (
        ngo.category_preference
    )

    # Available NGO capacity
    available_capacity = (
        capacity - current_demand
    )

    # Distance
    distance_km = haversine_distance(
        food.latitude,
        food.longitude,
        ngo.latitude,
        ngo.longitude
    )

    # Category compatibility
    category_match = int(
        category_preference == category
        or
        category_preference == "Any"
    )

    # Ratios
    quantity_capacity_ratio = (
        quantity /
        max(capacity, 1)
    )

    demand_coverage_ratio = (
        quantity /
        max(current_demand, 1)
    )

    # Capacity fit
    capacity_fit_score = np.clip(
        available_capacity /
        max(quantity, 1),
        0,
        1
    )

    # Demand score
    demand_score = np.clip(
        current_demand /
        max(quantity, 1),
        0,
        1
    )

    return pd.DataFrame([{
        "quantity": quantity,
        "category": category,
        "shelf_life_hours": shelf_life_hours,
        "hours_until_expiry": hours_until_expiry,
        "urgency_score": urgency_score,

        "capacity": capacity,
        "current_demand": current_demand,
        "available_capacity": available_capacity,
        "category_preference":
            category_preference,

        "distance_km": distance_km,
        "category_match": category_match,

        "quantity_capacity_ratio":
            quantity_capacity_ratio,

        "demand_coverage_ratio":
            demand_coverage_ratio,

        "capacity_fit_score":
            capacity_fit_score,

        "demand_score":
            demand_score
    }])


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def root():

    return {
        "message":
            "ZeroWaste Connect ML Service is running",

        "status": "OK",

        "model":
            "CatBoostClassifier",

        "model_version":
            model_bundle["model_version"]
    }


# ==========================================
# PREDICT MATCH
# ==========================================

@app.post("/predict-match")
def predict_match(request: MatchRequest):

    features = prepare_features(
        request.food,
        request.ngo
    )

    probability = model.predict_proba(
        features[feature_columns]
    )[0][1]

    prediction = int(
        probability >= 0.5
    )

    return {
        "match_probability":
            round(float(probability), 4),

        "match_prediction":
            prediction
    }