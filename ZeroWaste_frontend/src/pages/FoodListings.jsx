import { useState, useEffect } from 'react';
import { getFoodListings, createFoodListing, getRestaurants } from '../api';

function FoodListings() {
  const [foodListings, setFoodListings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressGeoLoading, setAddressGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper search field for coordinate lookup
  const [locationQuery, setLocationQuery] = useState('');

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

  const categories = [
    'Baked Goods',
    'Prepared Meals',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Canned Goods',
    'Other',
  ];

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-fill the address lookup field if the selected restaurant has a location
    if (name === 'restaurantId' && value) {
      const selectedRestaurant = restaurants.find(
        (r) => r.id === parseInt(value, 10)
      );
      if (selectedRestaurant && selectedRestaurant.location) {
        setLocationQuery(selectedRestaurant.location);
      }
    }
  };

  // 1. Browser Geolocation (Current device GPS)
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
        setSuccess('Fetched GPS coordinates successfully!');
      },
      (err) => {
        setError(`Unable to retrieve GPS coordinates: ${err.message}`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 2. Geocode from Address/Landmark using OpenStreetMap Nominatim
  const handleLookupLocation = async () => {
    if (!locationQuery.trim()) {
      setError('Please type an address or landmark first to search');
      return;
    }

    setAddressGeoLoading(true);
    setError(null);

    try {
      const query = encodeURIComponent(locationQuery.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6),
        }));
        setSuccess(`Found coordinates for "${data[0].display_name.slice(0, 45)}..."`);
      } else {
        setError('Location not found. Try including the city name (e.g., "Kothrud, Pune")');
      }
    } catch (err) {
      setError('Failed to fetch coordinates for this location.');
      console.error(err);
    } finally {
      setAddressGeoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        restaurantId: parseInt(formData.restaurantId, 10),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        shelfLifeHours: parseInt(formData.shelfLifeHours, 10),
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
      setLocationQuery('');
      const res = await getFoodListings();
      setFoodListings(res.data);
    } catch (err) {
      setError('Failed to add food listing');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out MATCHED records so only AVAILABLE ones appear
  const availableFoodListings = foodListings.filter(
    (food) => !food.status || food.status.toUpperCase() === 'AVAILABLE'
  );

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
                placeholder="e.g., Surplus Sandwiches"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Quantity (Meals / Units)</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="e.g., 25"
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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
                  <option key={r.id} value={r.id}>
                    {r.name} {r.location ? `(${r.location})` : ''}
                  </option>
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
              <label className="form-label">Shelf Life (Hours)</label>
              <input
                type="number"
                className="form-control"
                name="shelfLifeHours"
                value={formData.shelfLifeHours}
                onChange={handleChange}
                required
                placeholder="e.g., 12"
                min="1"
              />
            </div>

            {/* Location & Coordinates Helper */}
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0 fw-bold">
                  Pickup Location Coordinates
                </label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLoading}
                >
                  {geoLoading ? 'Detecting...' : '📍 Use Current GPS Location'}
                </button>
              </div>

              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search address or area for coordinates (e.g., FC Road, Pune)"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleLookupLocation}
                  disabled={addressGeoLoading}
                >
                  {addressGeoLoading ? 'Searching...' : '🔍 Find by Address'}
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">Lat</span>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 18.520430"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">Lon</span>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 73.856743"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Food Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* Available Food Listings List */}
      <div className="content-card">
        <h5>Available Food Listings ({availableFoodListings.length})</h5>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : availableFoodListings.length === 0 ? (
          <div className="empty-state">No active food listings available</div>
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
                  <th>Coordinates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {availableFoodListings.map((food) => (
                  <tr key={food.id}>
                    <td>#{food.id}</td>
                    <td><strong>{food.foodName}</strong></td>
                    <td>{food.quantity}</td>
                    <td>
                      <span className="badge badge-info">{food.category}</span>
                    </td>
                    <td>
                      {restaurants.find((r) => r.id === food.restaurantId)?.name ||
                        `Restaurant #${food.restaurantId}`}
                    </td>
                    <td>{food.shelfLifeHours}h</td>
                    <td>
                      <small className="text-muted">
                        {food.latitude ? Number(food.latitude).toFixed(4) : '-'},{' '}
                        {food.longitude ? Number(food.longitude).toFixed(4) : '-'}
                      </small>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {food.status || 'AVAILABLE'}
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