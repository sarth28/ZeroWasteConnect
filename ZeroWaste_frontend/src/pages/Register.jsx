import { useState } from 'react';

import {
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom';

import { useAuth } from '../auth/AuthContext';


function Register() {

  const {
    isAuthenticated,
    register
  } = useAuth();

  const navigate = useNavigate();


  const [formData, setFormData] = useState({

    role: 'RESTAURANT',

    name: '',

    email: '',

    contactNumber: '',

    location: '',

    password: '',

    confirmPassword: ''

  });


  const [error, setError] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);


  if (isAuthenticated) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previous) => ({

      ...previous,

      [name]: value

    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError(null);


    /*
     * Password validation
     */

    if (
      formData.password.length < 6
    ) {

      setError(
        'Password must contain at least 6 characters.'
      );

      return;

    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        'Passwords do not match.'
      );

      return;

    }


    setSubmitting(true);


    try {

      /*
       * Do NOT send confirmPassword
       * to the backend.
       */

      const user = await register({

        role: formData.role,

        name: formData.name,

        email: formData.email,

        contactNumber:
          formData.contactNumber,

        location:
          formData.location,

        password:
          formData.password

      });


      /*
       * Backend returns the new user's role.
       */

      if (user.role === 'RESTAURANT') {

        navigate(
          '/restaurant/dashboard',
          { replace: true }
        );

      }

      else if (user.role === 'NGO') {

        navigate(
          '/ngo/dashboard',
          { replace: true }
        );

      }

    } catch (err) {

      console.error(err);

      const message =
        err.response?.data?.message ||
        (
          typeof err.response?.data === 'string'
            ? err.response.data
            : null
        ) ||
        'Could not create the account.';

      setError(message);

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">


        {/* BRAND */}

        <div className="auth-brand">

          <h1>
            ZeroWaste Connect
          </h1>

          <p>
            Create your account
          </p>

        </div>


        <h4 className="mb-4">
          Register
        </h4>


        {/* ERROR */}

        {error && (

          <div className="alert alert-danger">
            {error}
          </div>

        )}


        <form onSubmit={handleSubmit}>


          {/* ROLE */}

          <label className="form-label">
            Account Type
          </label>

          <div className="role-grid mb-4">


            <button
              type="button"
              className={`role-card ${
                formData.role === 'RESTAURANT'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setFormData((previous) => ({
                  ...previous,
                  role: 'RESTAURANT'
                }))
              }
            >

              <span className="role-icon">
                🍽️
              </span>

              <strong>
                Restaurant
              </strong>

              <small>
                Donate surplus food
              </small>

            </button>


            <button
              type="button"
              className={`role-card ${
                formData.role === 'NGO'
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setFormData((previous) => ({
                  ...previous,
                  role: 'NGO'
                }))
              }
            >

              <span className="role-icon">
                🏛️
              </span>

              <strong>
                NGO
              </strong>

              <small>
                Receive food donations
              </small>

            </button>


          </div>


          {/* NAME */}

          <label className="form-label">

            {formData.role === 'RESTAURANT'
              ? 'Restaurant Name'
              : 'NGO Name'}

          </label>

          <input
            type="text"
            className="form-control mb-3"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder={
              formData.role === 'RESTAURANT'
                ? 'e.g. Green Leaf Kitchen'
                : 'e.g. Food Relief Foundation'
            }
          />


          {/* CONTACT */}

          <label className="form-label">
            Contact Number
          </label>

          <input
            type="tel"
            className="form-control mb-3"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />


          {/* LOCATION */}

          <label className="form-label">
            Location
          </label>

          <input
            type="text"
            className="form-control mb-3"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Kothrud, Pune"
          />


          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* CONFIRM PASSWORD */}

          <label className="form-label">
            Confirm Password
          </label>

          <input
            type="password"
            className="form-control mb-4"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Enter password again"
          />


          {/* BUTTON */}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting}
          >

            {submitting
              ? 'Creating account...'
              : 'Create Account'}

          </button>


        </form>


        {/* LOGIN LINK */}

        <div className="text-center mt-4">

          <span className="text-muted">
            Already have an account?
          </span>{' '}

          <Link to="/login">
            Login
          </Link>

        </div>


      </div>

    </div>

  );
}


export default Register;