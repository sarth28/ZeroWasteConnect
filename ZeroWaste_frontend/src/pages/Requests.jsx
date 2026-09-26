import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getDonationRequests, getNGOById, updateNGO } from '../api';
import { useAuth } from '../auth/AuthContext';

const categories = [
  'Baked Goods',
  'Prepared Meals',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Canned Goods',
  'Any',
];

function Requests() {
  const { user, isNgo } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    location: '',
    capacity: '',
    currentDemand: '',
    categoryPreference: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [requestRes, ngoRes] = await Promise.all([
          getDonationRequests(),
          user?.ngoId ? getNGOById(user.ngoId) : Promise.resolve({ data: null }),
        ]);
        setRequests(requestRes.data || []);
        if (ngoRes.data) {
          const ngo = ngoRes.data;
          setProfile({
            name: ngo.name || '',
            location: ngo.location || '',
            capacity: ngo.capacity ?? '',
            currentDemand: ngo.currentDemand ?? '',
            categoryPreference: ngo.categoryPreference || '',
            latitude: ngo.latitude ?? '',
            longitude: ngo.longitude ?? '',
          });
        }
      } catch (err) {
        setError('Failed to load NGO request data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.ngoId]);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfile((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGeoLoading(false);
        setSuccess('Location coordinates detected and pinned successfully.');
      },
      (err) => {
        setError(`Unable to retrieve GPS coordinates: ${err.message}`);
        setGeoLoading(false);
      }
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user?.ngoId) return;
    setSavingProfile(true);
    setError(null);
    setSuccess(null);
    try {
      await updateNGO(user.ngoId, {
        name: profile.name,
        location: profile.location,
        capacity: Number(profile.capacity),
        currentDemand: Number(profile.currentDemand),
        categoryPreference: profile.categoryPreference,
        latitude: profile.latitude !== '' ? Number(profile.latitude) : null,
        longitude: profile.longitude !== '' ? Number(profile.longitude) : null,
      });
      setSuccess('NGO profile saved. Matching can now use your capacity and location.');
    } catch (err) {
      setError('Failed to save NGO profile');
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!isNgo) {
    return <Navigate to="/" replace />;
  }

  const hasCoordinates = profile.latitude !== '' && profile.longitude !== '';

  return (
    <div>
      <div className="page-header">
        <h1>Donation Requirements</h1>
        <p>Keep your NGO capacity, food preference, and location details up to date for matching.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="form-section">
        <h5>NGO Matching Profile</h5>
        <form onSubmit={handleSaveProfile}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">NGO Name</label>
              <input
                className="form-control"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location / Address</label>
              <input
                className="form-control"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                required
                placeholder="e.g. Shivaji Nagar, Pune"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                min="0"
                className="form-control"
                name="capacity"
                value={profile.capacity}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Current Demand</label>
              <input
                type="number"
                min="0"
                className="form-control"
                name="currentDemand"
                value={profile.currentDemand}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category Preference</label>
              <select
                className="form-select"
                name="categoryPreference"
                value={profile.categoryPreference}
                onChange={handleProfileChange}
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

            {/* Seamless GPS Location Pinning */}
            <div className="col-12 mt-3 d-flex align-items-center gap-3">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleGetCurrentLocation}
                disabled={geoLoading}
              >
                {geoLoading ? 'Detecting GPS...' : '📍 Use Current GPS Location'}
              </button>

              {hasCoordinates && (
                <span className="badge badge-success" style={{ padding: '0.6rem 0.9rem' }}>
                  ✓ GPS coordinates captured
                </span>
              )}
            </div>
          </div>

          <button className="btn btn-primary mt-3" type="submit" disabled={savingProfile}>
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Read-only History of Requests */}
      <div className="content-card">
        <h5>Your Requests History ({requests.length})</h5>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="empty-state">No past donation requests recorded.</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>#{req.id}</td>
                    <td>
                      <span className="badge badge-info">{req.category}</span>
                    </td>
                    <td>{req.quantityNeeded}</td>
                    <td>{req.message || '-'}</td>
                    <td>
                      <span className="badge badge-warning">{req.status}</span>
                    </td>
                    <td>
                      {req.createdAt ? new Date(req.createdAt).toLocaleString() : '-'}
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

export default Requests;