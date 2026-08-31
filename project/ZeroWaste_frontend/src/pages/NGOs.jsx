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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert numeric fields from strings to numbers
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
      setError(
        editingId
          ? 'Failed to update NGO'
          : 'Failed to add NGO'
      );

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
    const confirmed = window.confirm(
      'Are you sure you want to delete this NGO?'
    );

    if (!confirmed) {
      return;
    }

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
        <h5>
          {editingId ? 'Edit NGO' : 'Add New NGO'}
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

            {/* Name */}
            <div className="col-md-4">
              <label className="form-label">
                NGO Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter NGO name"
              />
            </div>

            {/* Location */}
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

            {/* Capacity */}
            <div className="col-md-4">
              <label className="form-label">
                Capacity
              </label>

              <input
                type="number"
                className="form-control"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter capacity"
              />
            </div>

            {/* Current Demand */}
            <div className="col-md-4">
              <label className="form-label">
                Current Demand
              </label>

              <input
                type="number"
                className="form-control"
                name="currentDemand"
                value={formData.currentDemand}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter current demand"
              />
            </div>

            {/* Category Preference */}
            <div className="col-md-4">
              <label className="form-label">
                Category Preference
              </label>

              <input
                type="text"
                className="form-control"
                name="categoryPreference"
                value={formData.categoryPreference}
                onChange={handleChange}
                required
                placeholder="e.g. Vegetarian"
              />
            </div>

            {/* Latitude */}
            <div className="col-md-2">
              <label className="form-label">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                className="form-control"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
                placeholder="Latitude"
              />
            </div>

            {/* Longitude */}
            <div className="col-md-2">
              <label className="form-label">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                className="form-control"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
                placeholder="Longitude"
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
        <h5>
          All NGOs ({ngos.length})
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

        ) : ngos.length === 0 ? (

          <div className="empty-state">
            No NGOs registered yet
          </div>

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
                  <th>Category</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {ngos.map((ngo) => (
                  <tr key={ngo.id}>

                    <td>
                      #{ngo.id}
                    </td>

                    <td>
                      {ngo.name}
                    </td>

                    <td>
                      {ngo.location}
                    </td>

                    <td>
                      {ngo.capacity}
                    </td>

                    <td>
                      {ngo.currentDemand}
                    </td>

                    <td>
                      {ngo.categoryPreference}
                    </td>

                    <td>
                      {ngo.latitude}
                    </td>

                    <td>
                      {ngo.longitude}
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
                        onClick={() =>
                          handleDelete(ngo.id)
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

export default NGOs;