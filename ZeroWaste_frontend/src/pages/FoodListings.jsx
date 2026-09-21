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
    isNGO
  } = useAuth();


  const [foodListings, setFoodListings] =
    useState([]);

  const [restaurants, setRestaurants] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [geoLoading, setGeoLoading] =
    useState(false);

  const [addressGeoLoading, setAddressGeoLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [success, setSuccess] =
    useState(null);

  const [locationQuery, setLocationQuery] =
    useState('');


  /*
   * Form
   *
   * Notice:
   * There is NO restaurantId here.
   *
   * Backend gets restaurantId from JWT.
   */

  const [formData, setFormData] =
    useState({

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


  /*
   * Load food listings
   */

  useEffect(() => {

    fetchData();

  }, []);


  const fetchData = async () => {

    try {

      const [
        foodResponse,
        restaurantResponse
      ] = await Promise.all([

        getFoodListings(),

        getRestaurants()

      ]);


      setFoodListings(
        foodResponse.data || []
      );

      setRestaurants(
        restaurantResponse.data || []
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load food listings.'
      );

    } finally {

      setLoading(false);

    }

  };


  /*
   * Form input
   */

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


  /*
   * Get current GPS location
   */

  const handleGetCurrentLocation = () => {

    if (!navigator.geolocation) {

      setError(
        'Geolocation is not supported by your browser.'
      );

      return;

    }


    setGeoLoading(true);

    setError(null);


    navigator.geolocation.getCurrentPosition(

      (position) => {

        setFormData((previous) => ({

          ...previous,

          latitude:
            position.coords.latitude.toFixed(6),

          longitude:
            position.coords.longitude.toFixed(6)

        }));


        setGeoLoading(false);

        setSuccess(
          'GPS coordinates detected successfully.'
        );

      },


      (err) => {

        console.error(err);

        setError(
          `Unable to retrieve GPS coordinates: ${err.message}`
        );

        setGeoLoading(false);

      },

      {
        enableHighAccuracy: true,

        timeout: 10000
      }

    );

  };


  /*
   * Find coordinates from address
   */

  const handleLookupLocation = async () => {

    if (!locationQuery.trim()) {

      setError(
        'Please enter an address or area first.'
      );

      return;

    }


    setAddressGeoLoading(true);

    setError(null);


    try {

      const query =
        encodeURIComponent(
          locationQuery.trim()
        );


      const response = await fetch(

        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`

      );


      const data =
        await response.json();


      if (
        data &&
        data.length > 0
      ) {

        setFormData((previous) => ({

          ...previous,

          latitude:
            parseFloat(data[0].lat)
              .toFixed(6),

          longitude:
            parseFloat(data[0].lon)
              .toFixed(6)

        }));


        setSuccess(
          'Location coordinates found successfully.'
        );

      } else {

        setError(
          'Location not found. Try including the city name.'
        );

      }

    } catch (err) {

      console.error(err);

      setError(
        'Failed to find coordinates.'
      );

    } finally {

      setAddressGeoLoading(false);

    }

  };


  /*
   * SUBMIT FOOD
   */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError(null);

    setSuccess(null);


    try {

      /*
       * IMPORTANT:
       *
       * restaurantId is intentionally NOT sent.
       *
       * Backend gets it from the logged-in user.
       */

      const payload = {

        foodName:
          formData.foodName,

        quantity:
          parseInt(
            formData.quantity,
            10
          ),

        category:
          formData.category,

        expiryDate:
          formData.expiryDate,

        latitude:
          parseFloat(
            formData.latitude
          ),

        longitude:
          parseFloat(
            formData.longitude
          ),

        shelfLifeHours:
          parseInt(
            formData.shelfLifeHours,
            10
          )

      };


      await createFoodListing(
        payload
      );


      setSuccess(
        'Food listing added successfully!'
      );


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
        'Failed to add food listing.';

      setError(message);

    } finally {

      setSubmitting(false);

    }

  };


  /*
   * Only AVAILABLE food
   */

  const availableFoodListings =
    foodListings.filter(

      (food) =>

        !food.status ||

        food.status.toUpperCase() ===
        'AVAILABLE'

    );


  /*
   * Restaurant sees its own listings
   *
   * NGO sees available listings.
   *
   * NOTE:
   * This is frontend filtering only.
   * Backend should eventually provide
   * role-specific endpoints.
   */

  const visibleFoodListings =
    isRestaurant && user?.restaurantId

      ? availableFoodListings.filter(
          (food) =>
            food.restaurantId ===
            user.restaurantId
        )

      : availableFoodListings;


  /*
   * Find restaurant name
   */

  const getRestaurantName = (restaurantId) => {

    const restaurant =
      restaurants.find(
        (r) => r.id === restaurantId
      );


    if (restaurant) {

      return restaurant.name;

    }


    return restaurantId
      ? `Restaurant #${restaurantId}`
      : '-';

  };


  return (

    <div>


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-header">

        <h1>

          {isRestaurant
            ? 'Food Listings'
            : 'Available Food'}

        </h1>

        <p>

          {isRestaurant
            ? 'Add and manage your food donations.'
            : 'View food donations available from restaurants.'}

        </p>

      </div>


      {/* =========================
          MESSAGES
      ========================= */}

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


      {/* =========================
          RESTAURANT FORM
      ========================= */}

      {isRestaurant && (

        <div className="form-section">

          <h5>
            Add New Food Listing
          </h5>


          <div className="alert alert-info">

            <strong>
              Restaurant:
            </strong>{' '}

            {user?.name}

            <br />

            <small>
              Your account is automatically
              associated with this food listing.
            </small>

          </div>


          <form
            onSubmit={handleSubmit}
          >


            <div className="row g-3">


              {/* FOOD NAME */}

              <div className="col-md-4">

                <label className="form-label">
                  Food Name
                </label>

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


              {/* QUANTITY */}

              <div className="col-md-4">

                <label className="form-label">
                  Quantity
                </label>

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


              {/* CATEGORY */}

              <div className="col-md-4">

                <label className="form-label">
                  Category
                </label>

                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  {categories.map(
                    (category) => (

                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* EXPIRY */}

              <div className="col-md-4">

                <label className="form-label">
                  Expiry Date
                </label>

                <input
                  type="date"
                  className="form-control"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* SHELF LIFE */}

              <div className="col-md-4">

                <label className="form-label">
                  Shelf Life (Hours)
                </label>

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


              {/* LOCATION */}

              <div className="col-12">

                <label className="form-label fw-bold">

                  Pickup Location

                </label>


                <div className="input-group mb-2">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. FC Road, Pune"
                    value={locationQuery}
                    onChange={(e) =>
                      setLocationQuery(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={
                      handleLookupLocation
                    }
                    disabled={
                      addressGeoLoading
                    }
                  >

                    {addressGeoLoading
                      ? 'Searching...'
                      : '🔍 Find Coordinates'}

                  </button>

                </div>


                <button
                  type="button"
                  className="btn btn-sm btn-outline-success"
                  onClick={
                    handleGetCurrentLocation
                  }
                  disabled={geoLoading}
                >

                  {geoLoading
                    ? 'Detecting...'
                    : '📍 Use Current GPS'}

                </button>

              </div>


              {/* LATITUDE */}

              <div className="col-md-6">

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
                  placeholder="18.520430"
                />

              </div>


              {/* LONGITUDE */}

              <div className="col-md-6">

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
                  placeholder="73.856743"
                />

              </div>


            </div>


            <div className="mt-4">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >

                {submitting
                  ? 'Adding...'
                  : 'Add Food Listing'}

              </button>

            </div>


          </form>

        </div>

      )}


      {/* =========================
          FOOD LIST
      ========================= */}

      <div className="content-card">

        <h5>

          {isRestaurant
            ? `My Food Listings (${visibleFoodListings.length})`
            : `Available Food (${visibleFoodListings.length})`}

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

                  <th>Coordinates</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {visibleFoodListings.map(
                  (food) => (

                    <tr key={food.id}>

                      <td>
                        #{food.id}
                      </td>

                      <td>
                        <strong>
                          {food.foodName}
                        </strong>
                      </td>

                      <td>
                        {food.quantity}
                      </td>

                      <td>

                        <span className="badge badge-info">
                          {food.category}
                        </span>

                      </td>

                      <td>
                        {getRestaurantName(
                          food.restaurantId
                        )}
                      </td>

                      <td>
                        {food.shelfLifeHours}h
                      </td>

                      <td>

                        <small className="text-muted">

                          {food.latitude
                            ? Number(
                                food.latitude
                              ).toFixed(4)
                            : '-'}
                          ,

                          {' '}

                          {food.longitude
                            ? Number(
                                food.longitude
                              ).toFixed(4)
                            : '-'}

                        </small>

                      </td>

                      <td>

                        <span className="badge badge-success">

                          {food.status ||
                            'AVAILABLE'}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}


export default FoodListings;