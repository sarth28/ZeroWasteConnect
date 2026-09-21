import {
  useState,
  useEffect
} from 'react';

import {
  getFoodListings,
  matchFood,
  getMatches
} from '../api';

import { useAuth } from '../auth/AuthContext';


function Matching() {

  const {
    user,
    isRestaurant,
    isNGO
  } = useAuth();


  const [foodListings, setFoodListings] =
    useState([]);

  const [matches, setMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [matchingId, setMatchingId] =
    useState(null);

  const [error, setError] =
    useState(null);

  const [matchResult, setMatchResult] =
    useState(null);


  useEffect(() => {

    fetchData();

  }, []);


  const fetchData = async () => {

    try {

      const [
        foodResponse,
        matchesResponse
      ] = await Promise.all([

        getFoodListings(),

        getMatches()

      ]);


      setFoodListings(
        foodResponse.data || []
      );

      setMatches(
        matchesResponse.data || []
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load matching data.'
      );

    } finally {

      setLoading(false);

    }

  };


  /*
   * Match food
   *
   * Only Restaurant users get
   * the Match Food button.
   */

  const handleMatch = async (foodId) => {

    setMatchingId(foodId);

    setError(null);

    setMatchResult(null);


    try {

      const response =
        await matchFood(foodId);


      setMatchResult(
        response.data
      );


      await fetchData();


    } catch (err) {

      console.error(err);

      const message =
        err.response?.data?.message ||
        'Failed to match food.';

      setError(message);

    } finally {

      setMatchingId(null);

    }

  };


  /*
   * AVAILABLE FOOD
   */

  const availableFood =
    foodListings.filter(

      (food) =>

        !food.status ||

        food.status.toUpperCase() ===
        'AVAILABLE'

    );


  /*
   * Restaurant should see
   * its own food.
   *
   * NGO can see available food.
   */

  const visibleFood =
    isRestaurant && user?.restaurantId

      ? availableFood.filter(
          (food) =>
            food.restaurantId ===
            user.restaurantId
        )

      : availableFood;


  return (

    <div>


      {/* HEADER */}

      <div className="page-header">

        <h1>
          Smart Matching
        </h1>

        <p>

          {isRestaurant
            ? 'Match your surplus food with NGOs.'
            : 'View food matching information.'}

        </p>

      </div>


      {/* ERROR */}

      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      {/* SUCCESS */}

      {matchResult && (

        <div className="alert alert-success">

          <strong>
            Matching completed.
          </strong>

          <pre
            className="mt-2 mb-0"
            style={{
              whiteSpace: 'pre-wrap'
            }}
          >
            {JSON.stringify(
              matchResult,
              null,
              2
            )}
          </pre>

        </div>

      )}


      {/* =========================
          AVAILABLE FOOD
      ========================= */}

      <div className="content-card">

        <h5>

          Available Food
          {' '}
          ({visibleFood.length})

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

        ) : visibleFood.length === 0 ? (

          <div className="empty-state">

            No food is currently
            available for matching.

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

                  <th>Shelf Life</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {visibleFood.map(
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
                        {food.shelfLifeHours}h
                      </td>

                      <td>

                        {isRestaurant ? (

                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              handleMatch(
                                food.id
                              )
                            }
                            disabled={
                              matchingId ===
                              food.id
                            }
                          >

                            {matchingId ===
                            food.id
                              ? 'Matching...'
                              : 'Match Food'}

                          </button>

                        ) : (

                          <span className="text-muted">

                            Restaurant manages
                            matching

                          </span>

                        )}

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
          MATCH HISTORY
      ========================= */}

      <div className="content-card mt-4">

        <h5>
          Match History
        </h5>


        {matches.length === 0 ? (

          <div className="empty-state">

            No matches have been created yet.

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>Food</th>

                  <th>NGO</th>

                  <th>Status</th>

                </tr>

              </thead>


              <tbody>

                {matches.map(
                  (match, index) => (

                    <tr
                      key={
                        match.id ||
                        index
                      }
                    >

                      <td>

                        {match.id
                          ? `#${match.id}`
                          : `#${index + 1}`}

                      </td>

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


export default Matching;