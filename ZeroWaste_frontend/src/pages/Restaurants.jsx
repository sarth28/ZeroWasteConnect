import { useState, useEffect } from 'react';
import {
  getRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../api';

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactNumber: '',
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await getRestaurants();
      setRestaurants(res.data);
    } catch (err) {
      setError('Failed to load restaurants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update restaurant
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // Update existing restaurant
        await updateRestaurant(editingId, formData);

        setSuccess('Restaurant updated successfully!');
      } else {
        // Create new restaurant
        await createRestaurant(formData);

        setSuccess('Restaurant added successfully!');
      }

      // Reset form
      setFormData({
        name: '',
        location: '',
        contactNumber: '',
      });

      setEditingId(null);

      // Refresh restaurant list
      await fetchRestaurants();

    } catch (err) {
      setError(
        editingId
          ? 'Failed to update restaurant'
          : 'Failed to add restaurant'
      );

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);

    setFormData({
      name: restaurant.name,
      location: restaurant.location,
      contactNumber: restaurant.contactNumber,
    });

    setError(null);
    setSuccess(null);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: '',
      location: '',
      contactNumber: '',
    });

    setError(null);
    setSuccess(null);
  };

  // Delete restaurant
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this restaurant?'
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await deleteRestaurant(id);

      setSuccess('Restaurant deleted successfully!');

      // Refresh list
      await fetchRestaurants();

    } catch (err) {
      setError('Failed to delete restaurant');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Restaurants</h1>
        <p>Manage restaurant partners in the platform</p>
      </div>

      {/* Add / Edit Restaurant Form */}
      <div className="form-section">
        <h5>
          {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
        </h5>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-4">
              <label className="form-label">
                Restaurant Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter restaurant name"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Location
              </label>

              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Contact Number
              </label>

              <input
                type="tel"
                className="form-control"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                placeholder="Enter contact number"
              />
            </div>

          </div>

          <div className="mt-3">

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingId
                  ? 'Update Restaurant'
                  : 'Add Restaurant'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </div>

      {/* Restaurants List */}
      <div className="content-card">
        <h5>
          All Restaurants ({restaurants.length})
        </h5>

        {loading ? (
          <div className="loading-spinner">
            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
          </div>

        ) : restaurants.length === 0 ? (

          <div className="empty-state">
            No restaurants registered yet
          </div>

        ) : (

          <div className="table-responsive">
            <table className="table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Contact Number</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>

                    <td>
                      #{restaurant.id}
                    </td>

                    <td>
                      {restaurant.name}
                    </td>

                    <td>
                      {restaurant.location}
                    </td>

                    <td>
                      {restaurant.contactNumber}
                    </td>

                    <td>

                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(restaurant)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          handleDelete(restaurant.id)
                        }
                      >
                        Delete
                      </button>

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

export default Restaurants;