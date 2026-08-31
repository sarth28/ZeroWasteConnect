import { useState, useEffect } from 'react';
import { getFoodListings, matchFood, getMatches } from '../api';

function Matching() {
  const [foodListings, setFoodListings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchingId, setMatchingId] = useState(null);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodRes, matchesRes] = await Promise.all([
        getFoodListings(),
        getMatches(),
      ]);
      setFoodListings(foodRes.data);
      setMatches(matchesRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async (foodId) => {
    setMatchingId(foodId);
    setError(null);
    setMatchResult(null);

    try {
      const res = await matchFood(foodId);
      setMatchResult(res.data);
      fetchData();
    } catch (err) {
      setError('Failed to match food. Please try again.');
      console.error(err);
    } finally {
      setMatchingId(null);
    }
  };

  const availableFood = foodListings;

  return (
    <div>
      <div className="page-header">
        <h1>Smart Matching</h1>
        <p>Match available food donations with NGOs</p>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {/* Available Food for Matching */}
      <div className="content-card">
        <h5>Available Food Listings ({availableFood.length})</h5>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : availableFood.length === 0 ? (
          <div className="empty-state">No food available for matching</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Food Name</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Shelf Life</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableFood.map((food) => (
                  <tr key={food.id}>
                    <td>#{food.id}</td>
                    <td>{food.foodName}</td>
                    <td>{food.quantity}</td>
                    <td>
                      <span className="badge badge-info">{food.category}</span>
                    </td>
                    <td>{food.shelfLifeHours}h</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleMatch(food.id)}
                        disabled={matchingId === food.id}
                      >
                        {matchingId === food.id ? 'Matching...' : 'Match Food'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Match Result */}
        {matchResult && (
          <div className="match-details">
            <h6 style={{ color: 'var(--primary-green-dark)', marginBottom: '1rem' }}>
              Match Found!
            </h6>
            <p><strong>NGO ID:</strong> {matchResult.ngoId}</p>
            <p><strong>Match Score:</strong> {matchResult.matchScore?.toFixed(2) || 'N/A'}</p>
            <p><strong>Reason:</strong> {matchResult.matchingReason || 'N/A'}</p>
            <p><strong>Status:</strong> <span className="badge badge-success">{matchResult.status || 'matched'}</span></p>
          </div>
        )}
      </div>

      {/* Match History */}
      <div className="content-card">
        <h5>Match History ({matches.length})</h5>
        {matches.length === 0 ? (
          <div className="empty-state">No matches recorded yet</div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Match ID</th>
                  <th>Food ID</th>
                  <th>NGO ID</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Matched Time</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td>#{match.id}</td>
                    <td>#{match.foodListingId}</td>
                    <td>#{match.ngoId}</td>
                    <td>{match.matchScore?.toFixed(2) || '-'}</td>
                    <td>
                      <span className={`badge badge-${match.status === 'pending' ? 'warning' : 'success'}`}>
                        {match.status || 'completed'}
                      </span>
                    </td>
                    <td>{match.matchedAt ? new Date(match.matchedAt).toLocaleString() : '-'}</td>
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

export default Matching;
