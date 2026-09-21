import os
import pickle
import random
import numpy as np
import pandas as pd
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)

# ==========================================
# REPRODUCIBILITY SEEDS
# ==========================================
np.random.seed(42)
random.seed(42)

MODEL_OUTPUT_PATH = "zerowaste_match_model.pkl"

# ==========================================
# HAVERSINE DISTANCE HELPER
# ==========================================
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1 = np.radians(lat1)
    lat2 = np.radians(lat2)
    delta_lat = np.radians(lat2 - lat1)
    delta_lon = np.radians(lon2 - lon1)

    a = (
        np.sin(delta_lat / 2) ** 2
        + np.cos(lat1) * np.cos(lat2) * np.sin(delta_lon / 2) ** 2
    )
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c


# ==========================================
# SYNTHETIC DATA GENERATION
# ==========================================
def generate_dataset():
    print("Generating synthetic restaurants...")
    num_restaurants = 100
    restaurants = []
    for i in range(num_restaurants):
        restaurant_id = i + 1
        restaurants.append({
            "restaurant_id": restaurant_id,
            "restaurant_name": f"Restaurant {restaurant_id}",
            "location": random.choice([
                "Kothrud", "Baner", "Wakad", "Aundh", "Shivajinagar",
                "Viman Nagar", "Hadapsar", "Kharadi", "Pimpri", "Kondhwa"
            ]),
            "latitude": round(np.random.uniform(18.45, 18.65), 6),
            "longitude": round(np.random.uniform(73.75, 73.98), 6),
        })
    restaurants_df = pd.DataFrame(restaurants)

    print("Generating synthetic NGOs...")
    num_ngos = 50
    categories = [
        "Vegetables", "Fruits", "Dairy", "Baked Goods",
        "Prepared Meals", "Canned Goods", "Other"
    ]
    ngo_preferences = categories + ["Any"]
    ngos = []
    for i in range(num_ngos):
        ngo_id = i + 1
        capacity = random.randint(30, 300)
        current_demand = random.randint(10, capacity)
        ngos.append({
            "ngo_id": ngo_id,
            "ngo_name": f"NGO {ngo_id}",
            "location": random.choice([
                "Kothrud", "Baner", "Wakad", "Aundh", "Shivajinagar",
                "Viman Nagar", "Hadapsar", "Kharadi", "Pimpri", "Kondhwa"
            ]),
            "capacity": capacity,
            "current_demand": current_demand,
            "category_preference": random.choice(ngo_preferences),
            "latitude": round(np.random.uniform(18.45, 18.65), 6),
            "longitude": round(np.random.uniform(73.75, 73.98), 6),
        })
    ngos_df = pd.DataFrame(ngos)

    print("Generating synthetic food listings...")
    num_food_listings = 1000
    food_names = {
        "Vegetables": ["Mixed Vegetables", "Vegetable Curry", "Fresh Vegetables", "Vegetable Rice"],
        "Fruits": ["Mixed Fruits", "Fruit Salad", "Fresh Fruit", "Cut Fruits"],
        "Dairy": ["Milk", "Curd", "Paneer", "Yogurt"],
        "Baked Goods": ["Bread", "Buns", "Pastries", "Cakes"],
        "Prepared Meals": ["Rice and Curry", "Biryani", "Dal Rice", "Meal Boxes"],
        "Canned Goods": ["Canned Beans", "Canned Vegetables", "Canned Soup", "Canned Fruits"],
        "Other": ["Packaged Food", "Snacks", "Mixed Food Items"],
    }

    food_listings = []
    for i in range(num_food_listings):
        food_id = i + 1
        restaurant = restaurants_df.sample(n=1).iloc[0]
        category = random.choice(categories)
        food_name = random.choice(food_names[category])
        quantity = random.randint(10, 150)

        if category == "Prepared Meals":
            shelf_life_hours = random.randint(4, 12)
        elif category == "Dairy":
            shelf_life_hours = random.randint(6, 48)
        elif category in ["Baked Goods", "Vegetables"]:
            shelf_life_hours = random.randint(12, 72)
        elif category == "Fruits":
            shelf_life_hours = random.randint(12, 96)
        elif category == "Canned Goods":
            shelf_life_hours = random.randint(72, 720)
        else:
            shelf_life_hours = random.randint(24, 168)

        hours_until_expiry = random.randint(1, shelf_life_hours)
        listing_date = pd.Timestamp("2026-01-01") + pd.Timedelta(hours=random.randint(0, 24 * 180))
        expiry_date = listing_date + pd.Timedelta(hours=hours_until_expiry)

        food_listings.append({
            "food_id": food_id,
            "restaurant_id": int(restaurant["restaurant_id"]),
            "food_name": food_name,
            "quantity": quantity,
            "category": category,
            "shelf_life_hours": shelf_life_hours,
            "hours_until_expiry": hours_until_expiry,
            "expiry_date": expiry_date,
            "latitude": restaurant["latitude"],
            "longitude": restaurant["longitude"],
        })
    food_df = pd.DataFrame(food_listings)

    # Urgency Score
    food_df["urgency_score"] = 1 - (food_df["hours_until_expiry"] / food_df["shelf_life_hours"])

    print("Building cross-product candidate pairs (50,000 samples)...")
    food_df["_key"] = 1
    ngos_df["_key"] = 1
    match_df = pd.merge(food_df, ngos_df, on="_key", suffixes=("_food", "_ngo")).drop(columns=["_key"])

    # Feature Engineering
    match_df["distance_km"] = haversine_distance(
        match_df["latitude_food"], match_df["longitude_food"],
        match_df["latitude_ngo"], match_df["longitude_ngo"]
    ).round(2)

    match_df["category_match"] = (
        (match_df["category"] == match_df["category_preference"])
        | (match_df["category_preference"] == "Any")
    ).astype(int)

    match_df["quantity_capacity_ratio"] = (match_df["quantity"] / match_df["capacity"].replace(0, 1)).clip(upper=5)
    match_df["demand_coverage_ratio"] = (match_df["quantity"] / match_df["current_demand"].replace(0, 1)).clip(upper=5)
    match_df["distance_score"] = np.exp(-match_df["distance_km"] / 7)
    match_df["available_capacity"] = match_df["capacity"] - match_df["current_demand"]
    match_df["capacity_fit_score"] = np.clip(match_df["available_capacity"] / match_df["quantity"].replace(0, 1), 0, 1)
    match_df["demand_score"] = np.clip(match_df["current_demand"] / match_df["quantity"].replace(0, 1), 0, 1)

    # Latent Suitability & Noise
    match_df["suitability_score"] = (
        0.25 * match_df["category_match"]
        + 0.20 * match_df["capacity_fit_score"]
        + 0.20 * match_df["demand_score"]
        + 0.15 * match_df["distance_score"]
        + 0.10 * match_df["urgency_score"]
        + 0.10 * (1 - np.minimum(match_df["demand_coverage_ratio"], 1))
    )

    noise = np.random.normal(loc=0, scale=0.12, size=len(match_df))
    match_df["match_probability"] = (match_df["suitability_score"] + noise).clip(0.02, 0.98)
    match_df["match_success"] = (np.random.random(len(match_df)) < match_df["match_probability"]).astype(int)

    return match_df


# ==========================================
# MAIN TRAINING PIPELINE
# ==========================================
def train_and_export():
    match_df = generate_dataset()

    feature_columns = [
        "quantity", "category", "shelf_life_hours", "hours_until_expiry",
        "urgency_score", "capacity", "current_demand", "available_capacity",
        "category_preference", "distance_km", "category_match",
        "quantity_capacity_ratio", "demand_coverage_ratio",
        "capacity_fit_score", "demand_score"
    ]
    categorical_features = ["category", "category_preference"]

    X = match_df[feature_columns].copy()
    y = match_df["match_success"].copy()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print("\nTraining CatBoostClassifier (1000 iterations, depth=8, lr=0.03)...")
    cat_model = CatBoostClassifier(
        iterations=1000,
        learning_rate=0.03,
        depth=8,
        loss_function="Logloss",
        eval_metric="AUC",
        random_seed=42,
        verbose=100
    )

    cat_model.fit(
        X_train,
        y_train,
        cat_features=categorical_features,
        eval_set=(X_test, y_test),
        use_best_model=True
    )

    # Evaluation
    y_prob = cat_model.predict_proba(X_test)[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)

    print("\n" + "=" * 40)
    print("FINAL CATBOOST EVALUATION RESULTS")
    print("=" * 40)
    print("Accuracy :", round(accuracy_score(y_test, y_pred), 4))
    print("Precision:", round(precision_score(y_test, y_pred), 4))
    print("Recall   :", round(recall_score(y_test, y_pred), 4))
    print("F1 Score :", round(f1_score(y_test, y_pred), 4))
    print("ROC-AUC  :", round(roc_auc_score(y_test, y_prob), 4))
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))

    # Serialize Model Bundle
    model_bundle = {
        "model": cat_model,
        "feature_columns": feature_columns,
        "categorical_features": categorical_features,
        "model_name": "ZeroWaste Connect NGO Match Predictor",
        "model_version": "1.0",
    }

    with open(MODEL_OUTPUT_PATH, "wb") as f:
        pickle.dump(model_bundle, f)

    print(f"\n[✓] Successfully serialized bundle to '{MODEL_OUTPUT_PATH}'.")


if __name__ == "__main__":
    train_and_export()