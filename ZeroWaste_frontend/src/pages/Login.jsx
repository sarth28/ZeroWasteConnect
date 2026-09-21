import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Login() {
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('RESTAURANT');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    location: '',
    password: '',
  });

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          role === 'NGO'
            ? '/ngo/dashboard'
            : '/restaurant/dashboard'
        }
        replace
      />
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const goToDashboard = (userRole) => {
    navigate(
      userRole === 'NGO'
        ? '/ngo/dashboard'
        : '/restaurant/dashboard',
      { replace: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSubmitting(true);

    try {
      let data;

      if (mode === 'login') {
        data = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        data = await register({
          role,
          name: formData.name,
          email: formData.email,
          contactNumber: formData.contactNumber,
          location: formData.location,
          password: formData.password,
        });
      }

      goToDashboard(data.role);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : null) ||
        (
          mode === 'login'
            ? 'Invalid email or password'
            : 'Could not create account'
        );

      setError(message);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <h1>ZeroWaste Connect</h1>
          <p>
            Restaurants donate surplus food.
            NGOs request and redistribute it.
          </p>
        </div>

        <div className="auth-toggle">

          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Register
          </button>

        </div>

        <h5 className="mb-3">I am a...</h5>

        <div className="role-grid">

          <button
            type="button"
            className={`role-card ${
              role === 'RESTAURANT' ? 'selected' : ''
            }`}
            onClick={() => setRole('RESTAURANT')}
          >
            <span className="role-icon">🍽️</span>
            <strong>Restaurant</strong>
            <small>I want to put up a donation</small>
          </button>

          <button
            type="button"
            className={`role-card ${
              role === 'NGO' ? 'selected' : ''
            }`}
            onClick={() => setRole('NGO')}
          >
            <span className="role-icon">🏛️</span>
            <strong>NGO</strong>
            <small>I want to request a donation</small>
          </button>

        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {mode === 'register' && (
            <>
              <label className="form-label">
                {role === 'RESTAURANT'
                  ? 'Restaurant name'
                  : 'NGO name'}
              </label>

              <input
                className="form-control mb-3"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={
                  role === 'RESTAURANT'
                    ? 'e.g. Green Leaf Kitchen'
                    : 'e.g. Robin Hood Army'
                }
              />

              <label className="form-label">
                Contact number
              </label>

              <input
                className="form-control mb-3"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />

              <label className="form-label">
                Location
              </label>

              <input
                className="form-control mb-3"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Kothrud, Pune"
              />
            </>
          )}

          <label className="form-label">
            Email
          </label>

          <input
            type="email"
            className="form-control mb-3"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />

          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            className="form-control mb-3"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />

          {mode === 'login' && (
            <p
              className="text-muted"
              style={{ fontSize: '0.85rem' }}
            >
              Choose Restaurant or NGO above.
            </p>
          )}

          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Please wait...'
              : mode === 'login'
                ? `Login as ${
                    role === 'RESTAURANT'
                      ? 'Restaurant'
                      : 'NGO'
                  }`
                : `Create ${
                    role === 'RESTAURANT'
                      ? 'restaurant'
                      : 'NGO'
                  } account`}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;