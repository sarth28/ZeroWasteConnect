import {
  useState,
  useEffect
} from 'react';

import {
  getFoodListings,
  createFoodListing,
  getRestaurants
} from '../api';

import { useAuth } from '../auth/AuthContext';

function FoodListings() {
  const {
    user,
    isRestaurant,
  } = useAuth();

  const [foodListings, setFoodListings] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressGeoLoading, setAddressGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    category: '',
    expiryDate: '',
    latitude: '',
    longitude: '',
    shelfLifeHours: ''
  });

  const categories = [
    'Baked Goods',
    'Prepared Meals',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Canned Goods',
    'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodResponse, restaurantResponse] = await Promise.all([
        getFoodListings(),
        getRestaurants()
      ]);

      setFoodListings(foodResponse.data || []);
      setRestaurants(restaurantResponse.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load food listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setGeoLoading(false);
        setSuccess('Pickup location pinned via GPS.');
      },
      (err) => {
        console.error(err);
        setError(`Unable to retrieve GPS coordinates: ${err.message}`);
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  const handleLookupLocation = async () => {
    if (!locationQuery.trim()) {
      setError('Please enter an address or area first.');
      return;
    }

    setAddressGeoLoading(true);
    setError(null);

    try {
      const query = encodeURIComponent(locationQuery.trim());
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6)
        }));
        setSuccess(`Location found and pinned for "${locationQuery}".`);
      } else {
        setError('Location not found. Try including the city name.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to find coordinates.');
    } finally {
      setAddressGeoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!formData.latitude || !formData.longitude) {
      setError('Please set the pickup location using GPS or the address search.');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        foodName: formData.foodName,
        quantity: parseInt(formData.quantity, 10),
        category: formData.category,
        expiryDate: formData.expiryDate,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        shelfLifeHours: parseInt(formData.shelfLifeHours, 10)
      };

      await createFoodListing(payload);

      setSuccess('Food listing added successfully!');
      setFormData({
        foodName: '',
        quantity: '',
        category: '',
        expiryDate: '',
        latitude: '',
        longitude: '',
        shelfLifeHours: ''
      });
      setLocationQuery('');

      await fetchData();
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Failed to add food listing.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const availableFoodListings = foodListings.filter(
    (food) => !food.status || food.status.toUpperCase() === 'AVAILABLE'
  );

  const visibleFoodListings =
    isRestaurant && user?.restaurantId
      ? availableFoodListings.filter(
          (food) => food.restaurantId === user.restaurantId
        )
      : availableFoodListings;

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.name : restaurantId ? `Restaurant #${restaurantId}` : '-';
  };

  const hasLocation = formData.latitude !== '' && formData.longitude !== '';

  return (
    <div>
      <div className="page-header">
        <h1>{isRestaurant ? 'Food Listings' : 'Available Food'}</h1>
        <p>
          {isRestaurant
            ? 'Add and manage your food donations.'
            : 'View food donations available from restaurants.'}
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {isRestaurant && (
        <div className="form-section">
          <h5>Add New Food Listing</h5>

          <div className="alert alert-info">
            <strong>Restaurant:</strong> {user?.name}
            <br />
            <small>Your account is automatically associated with this food listing.</small>
          </div>

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
                  placeholder="e.g. Sandwiches"
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
                  min="1"
                  placeholder="e.g. 25"
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
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
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

              <div className="col-md-6">
                <label className="form-label">Shelf Life (Hours)</label>
                <input
                  type="number"
                  className="form-control"
                  name="shelfLifeHours"
                  value={formData.shelfLifeHours}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 12"
                />
              </div>

              {/* Seamless Location Selection */}
              <div className="col-12 mt-3">
                <label className="form-label fw-bold">Pickup Location</label>

                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search address or area (e.g. FC Road, Pune)"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleLookupLocation}
                    disabled={addressGeoLoading}
                  >
                    {addressGeoLoading ? 'Searching...' : '🔍 Find Address'}
                  </button>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={handleGetCurrentLocation}
                    disabled={geoLoading}
                  >
                    {geoLoading ? 'Detecting...' : '📍 Use Current GPS'}
                  </button>

                  {hasLocation && (
                    <span className="badge badge-success" style={{ padding: '0.55rem 0.85rem' }}>
                      ✓ Pickup location pinned
                    </span>
                  )}
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
      )}

      {/* Food Listings Table */}
      <div className="content-card">
        <h5>
          {isRestaurant
            ? `My Food Listings (${visibleFoodListings.length})`
            : `Available Food (${visibleFoodListings.length})`}
        </h5>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : visibleFoodListings.length === 0 ? (
          <div className="empty-state">
            {isRestaurant
              ? 'You have no active food listings.'
              : 'No food is currently available.'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Restaurant</th>
                  <th>Shelf Life</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleFoodListings.map((food) => (
                  <tr key={food.id}>
                    <td>#{food.id}</td>
                    <td><strong>{food.foodName}</strong></td>
                    <td>{food.quantity}</td>
                    <td>
                      <span className="badge badge-info">{food.category}</span>
                    </td>
                    <td>{getRestaurantName(food.restaurantId)}</td>
                    <td>{food.shelfLifeHours}h</td>
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