import { useState, useEffect } from 'react';
import { getFoodListings, createFoodListing, getRestaurants } from '../api';

function FoodListings() {
  const [foodListings, setFoodListings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    category: '',
    restaurantId: '',
    expiryDate: '',
    latitude: '',
    longitude: '',
    shelfLifeHours: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, restaurantsRes] = await Promise.all([
          getFoodListings(),
          getRestaurants(),
        ]);
        setFoodListings(foodRes.data);
        setRestaurants(restaurantsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        restaurantId: parseInt(formData.restaurantId),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        shelfLifeHours: parseInt(formData.shelfLifeHours),
      };
      await createFoodListing(payload);
      setSuccess('Food listing added successfully!');
      setFormData({
        foodName: '',
        quantity: '',
        category: '',
        restaurantId: '',
        expiryDate: '',
        latitude: '',
        longitude: '',
        shelfLifeHours: '',
      });
      const res = await getFoodListings();
      setFoodListings(res.data);
    } catch (err) {
      setError('Failed to add food listing');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['Vegetables', 'Fruits', 'Dairy', 'Baked Goods', 'Prepared Meals', 'Canned Goods', 'Other'];

  return (
    <div>
      <div className="page-header">
        <h1>Food Listings</h1>
        <p>Manage available food donations from restaurants</p>
      </div>

      {/* Add Food Listing Form */}
      <div className="form-section">
        <h5>Add New Food Listing</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Food Name</label>
              <input
                type="text"
                className="form-control"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                required
                placeholder="Enter food name"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="e.g., 10"
                min="1"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Restaurant</label>
              <select
                className="form-select"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
              >
                <option value="">Select restaurant</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Expiry Date</label>
              <input
                  type="date"
                  className="form-control"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
            </div>
            <div className="col-md-4">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                placeholder="e.g., 40.7128"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="any"
                className="form-control"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                placeholder="e.g., -74.0060"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Shelf Life (Hours)</label>
              <input
                type="number"
                className="form-control"
                name="shelfLifeHours"
                value={formData.shelfLifeHours}
                onChange={handleChange}
                required
                placeholder="e.g., 24"
                min="1"
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Food Listing'}
            </button>
            </div>
        </form>
      </div>

      {/* Food Listings List */}
      <div className="content-card">
        <h5>All Food Listings ({foodListings.length})</h5>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : foodListings.length === 0 ? (
          <div className="empty-state">No food listings available</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Restaurant</th>
                  <th>Shelf Life</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {foodListings.map((food) => (
                  <tr key={food.id}>
                    <td>#{food.id}</td>
                    <td>{food.foodName}</td>
                    <td>{food.quantity}</td>
                    <td>
                      <span className="badge badge-info">{food.category}</span>
                    </td>
                    <td>{food.restaurant?.name || `Restaurant #${food.restaurantId}`}</td>
                    <td>{food.shelfLifeHours}h</td>
                    <td>
                      <span className={`badge badge-${food.status === 'matched' ? 'warning' : 'success'}`}>
                        {food.status || 'available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodListings;
