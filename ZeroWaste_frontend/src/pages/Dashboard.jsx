import {
  useState,
  useEffect
} from 'react';

import {
  getAnalytics,
  getFoodListings,
  getMatches
} from '../api';

import { useAuth } from '../auth/AuthContext';


function Dashboard() {

  const {
    user,
    isRestaurant,
    isNGO
  } = useAuth();


  const [analytics, setAnalytics] =
    useState(null);

  const [recentFood, setRecentFood] =
    useState([]);

  const [recentMatches, setRecentMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    fetchData();

  }, [user]);


  const fetchData = async () => {

    try {

      const [
        analyticsResponse,
        foodResponse,
        matchesResponse
      ] = await Promise.all([

        getAnalytics(),

        getFoodListings(),

        getMatches()

      ]);


      setAnalytics(
        analyticsResponse.data
      );


      const foods =
        foodResponse.data || [];

      const matches =
        matchesResponse.data || [];


      /*
       * Restaurant:
       * show only its own food.
       */

      const scopedFood =
        isRestaurant &&
        user?.restaurantId

          ? foods.filter(
              (food) =>
                food.restaurantId ===
                user.restaurantId
            )

          : foods;


      /*
       * Restaurant:
       * show matches involving its food.
       *
       * NGO:
       * show matches belonging to its NGO.
       */

      const scopedMatches =

        isNGO && user?.ngoId

          ? matches.filter(
              (match) =>
                match.ngoId ===
                user.ngoId
            )

          : isRestaurant &&
            user?.restaurantId

            ? matches.filter(
                (match) => {

                  const food =
                    foods.find(
                      (item) =>
                        item.id ===
                        match.foodListingId
                    );

                  return (
                    food?.restaurantId ===
                    user.restaurantId
                  );

                }
              )

            : matches;


      setRecentFood(
        scopedFood.slice(0, 5)
      );


      setRecentMatches(
        scopedMatches.slice(0, 5)
      );


    } catch (err) {

      console.error(err);

      setError(
        'Failed to load dashboard data. Make sure the backend is running.'
      );

    } finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (

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

    );

  }


  return (

    <div>


      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">

        <h1>
          Dashboard
        </h1>

        <p>

          Welcome,
          {' '}
          <strong>
            {user?.name}
          </strong>

          .

          {' '}

          {isRestaurant

            ? 'Manage your surplus food donations.'

            : 'View food available for your NGO.'}

        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="alert alert-warning">

          {error}

        </div>

      )}


      {/* =========================
          ROLE CARD
      ========================= */}

      <div className="content-card mb-4">

        <h5>

          {isRestaurant
            ? '🍽️ Restaurant Account'
            : '🏛️ NGO Account'}

        </h5>

        <p className="mb-1">

          <strong>
            Name:
          </strong>

          {' '}

          {user?.name}

        </p>

        <p className="mb-1">

          <strong>
            Email:
          </strong>

          {' '}

          {user?.email}

        </p>

        <p className="mb-0">

          <strong>
            Contact:
          </strong>

          {' '}

          {user?.contactNumber ||
            'Not provided'}

        </p>

      </div>


      {/* =========================
          KPI CARDS
      ========================= */}

      <div className="row g-3 mb-4">


        <div className="col-md-3">

          <div className="kpi-card">

            <div className="kpi-icon">
              🍽️
            </div>

            <div>

              <div className="kpi-label">
                Restaurants
              </div>

              <div className="kpi-value">
                {analytics?.restaurants || 0}
              </div>

            </div>

          </div>

        </div>


        <div className="col-md-3">

          <div className="kpi-card">

            <div className="kpi-icon">
              🏛️
            </div>

            <div>

              <div className="kpi-label">
                NGOs
              </div>

              <div className="kpi-value">
                {analytics?.ngos || 0}
              </div>

            </div>

          </div>

        </div>


        <div className="col-md-3">

          <div className="kpi-card">

            <div className="kpi-icon">
              📦
            </div>

            <div>

              <div className="kpi-label">
                Food Listings
              </div>

              <div className="kpi-value">
                {analytics?.foodListings || 0}
              </div>

            </div>

          </div>

        </div>


        <div className="col-md-3">

          <div className="kpi-card">

            <div className="kpi-icon">
              🔗
            </div>

            <div>

              <div className="kpi-label">
                Matches
              </div>

              <div className="kpi-value">
                {analytics?.matches || 0}
              </div>

            </div>

          </div>

        </div>


      </div>


      {/* =========================
          RECENT FOOD
      ========================= */}

      <div className="content-card mb-4">

        <h5>

          {isRestaurant
            ? 'My Recent Food Listings'
            : 'Available Food'}

        </h5>


        {recentFood.length === 0 ? (

          <div className="empty-state">

            No food listings found.

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

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {recentFood.map(
                  (food) => (

                    <tr key={food.id}>

                      <td>
                        #{food.id}
                      </td>

                      <td>
                        {food.foodName}
                      </td>

                      <td>
                        {food.quantity}
                      </td>

                      <td>
                        {food.category}
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


      {/* =========================
          RECENT MATCHES
      ========================= */}

      <div className="content-card">

        <h5>
          Recent Matches
        </h5>


        {recentMatches.length === 0 ? (

          <div className="empty-state">

            No matches found.

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table">

              <thead>

                <tr>

                  <th>Food</th>

                  <th>NGO</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {recentMatches.map(
                  (match, index) => (

                    <tr
                      key={
                        match.id ||
                        index
                      }
                    >

                      <td>

                        {match.foodListingId
                          ? `Food #${match.foodListingId}`
                          : '-'}

                      </td>

                      <td>

                        {match.ngoId
                          ? `NGO #${match.ngoId}`
                          : '-'}

                      </td>

                      <td>

                        <span className="badge badge-success">

                          {match.status ||
                            'MATCHED'}

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


export default Dashboard;