import { useState, useEffect } from 'react';
import {
  getNGOs,
  createNGO,
  updateNGO,
  deleteNGO,
} from '../api';

function NGOs() {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [addressGeoLoading, setAddressGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    currentDemand: '',
    categoryPreference: '',
    latitude: '',
    longitude: '',
  });

  const categories = [
    'Baked Goods',
    'Prepared Meals',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Canned Goods',
    'Any',
  ];

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const res = await getNGOs();
      setNGOs(res.data);
    } catch (err) {
      setError('Failed to load NGOs');
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

  // 1. Browser Geolocation (Current device location)
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
        setSuccess('Fetched current coordinates successfully!');
      },
      (err) => {
        setError(`Unable to retrieve location: ${err.message}`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 2. Geocode from Location Name (Free OpenStreetMap API)
  const handleLookupLocation = async () => {
    if (!formData.location.trim()) {
      setError('Please enter a location name first to lookup coordinates');
      return;
    }

    setAddressGeoLoading(true);
    setError(null);

    try {
      const query = encodeURIComponent(formData.location.trim());
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
        setSuccess(`Found coordinates for "${data[0].display_name.slice(0, 40)}..."`);
      } else {
        setError('Location not found. Try adding a city name (e.g., "Shivajinagar, Pune")');
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
      const data = {
        name: formData.name,
        location: formData.location,
        capacity: Number(formData.capacity),
        currentDemand: Number(formData.currentDemand),
        categoryPreference: formData.categoryPreference,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      if (editingId) {
        await updateNGO(editingId, data);
        setSuccess('NGO updated successfully!');
      } else {
        await createNGO(data);
        setSuccess('NGO added successfully!');
      }

      resetForm();
      await fetchNGOs();
    } catch (err) {
      setError(editingId ? 'Failed to update NGO' : 'Failed to add NGO');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ngo) => {
    setEditingId(ngo.id);

    setFormData({
      name: ngo.name || '',
      location: ngo.location || '',
      capacity: ngo.capacity ?? '',
      currentDemand: ngo.currentDemand ?? '',
      categoryPreference: ngo.categoryPreference || '',
      latitude: ngo.latitude ?? '',
      longitude: ngo.longitude ?? '',
    });

    setError(null);
    setSuccess(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setError(null);
    setSuccess(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this NGO?');
    if (!confirmed) return;

    setError(null);
    setSuccess(null);

    try {
      await deleteNGO(id);
      setSuccess('NGO deleted successfully!');
      await fetchNGOs();
    } catch (err) {
      setError('Failed to delete NGO');
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      currentDemand: '',
      categoryPreference: '',
      latitude: '',
      longitude: '',
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>NGOs</h1>
        <p>Manage NGO partners in the platform</p>
      </div>

      {/* Add / Edit NGO Form */}
      <div className="form-section">
        <h5>{editingId ? 'Edit NGO' : 'Add New NGO'}</h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">NGO Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Robin Hood Army"
              />
            </div>

            {/* Location with Auto-Geocode Button */}
            <div className="col-md-6">
              <label className="form-label">Location / Address</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Kothrud, Pune"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleLookupLocation}
                  disabled={addressGeoLoading}
                  title="Search coordinates based on this location text"
                >
                  {addressGeoLoading ? 'Searching...' : '🔍 Find Coords'}
                </button>
              </div>
            </div>

            {/* Capacity */}
            <div className="col-md-4">
              <label className="form-label">Total Capacity (Meals)</label>
              <input
                type="number"
                className="form-control"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 200"
              />
            </div>

            {/* Current Demand */}
            <div className="col-md-4">
              <label className="form-label">Current Demand (Meals)</label>
              <input
                type="number"
                className="form-control"
                name="currentDemand"
                value={formData.currentDemand}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 50"
              />
            </div>

            {/* Category Preference */}
            <div className="col-md-4">
              <label className="form-label">Category Preference</label>
              <select
                className="form-select"
                name="categoryPreference"
                value={formData.categoryPreference}
                onChange={handleChange}
                required
              >
                <option value="">Select preference</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinates Section */}
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Location Coordinates</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={handleGetCurrentLocation}
                  disabled={geoLoading}
                >
                  {geoLoading ? 'Detecting...' : '📍 Use Current GPS Location'}
                </button>
              </div>
            </div>

            {/* Latitude */}
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
                  placeholder="e.g. 18.520430"
                />
              </div>
            </div>

            {/* Longitude */}
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
                  placeholder="e.g. 73.856743"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingId
                ? 'Update NGO'
                : 'Add NGO'}
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

      {/* NGO List */}
      <div className="content-card">
        <h5>All NGOs ({ngos.length})</h5>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ngos.length === 0 ? (
          <div className="empty-state">No NGOs registered yet</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Demand</th>
                  <th>Preference</th>
                  <th>Coordinates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ngos.map((ngo) => (
                  <tr key={ngo.id}>
                    <td>#{ngo.id}</td>
                    <td><strong>{ngo.name}</strong></td>
                    <td>{ngo.location}</td>
                    <td>{ngo.capacity}</td>
                    <td>{ngo.currentDemand}</td>
                    <td>
                      <span className="badge badge-info">
                        {ngo.categoryPreference}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {ngo.latitude?.toFixed(4)}, {ngo.longitude?.toFixed(4)}
                      </small>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(ngo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(ngo.id)}
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

export default NGOs;