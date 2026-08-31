import { useState, useEffect } from 'react';
import { getAnalytics, getFoodListings, getMatches } from '../api';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentFood, setRecentFood] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, foodRes, matchesRes] = await Promise.all([
          getAnalytics(),
          getFoodListings(),
          getMatches(),
        ]);
        setAnalytics(analyticsRes.data);
        setRecentFood(foodRes.data.slice(0, 5));
        setRecentMatches(matchesRes.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data. Make sure the backend is running.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-card">
        <div className="alert alert-warning mb-0">{error}</div>
      </div>
    );
  }

  const kpis = [
    { label: 'Total Restaurants', value: analytics?.totalRestaurants || 0, icon: '🍽️' },
    { label: 'Total NGOs', value: analytics?.totalNGOs || 0, icon: '🏛️' },
    { label: 'Food Listings', value: analytics?.totalFoodListings || 0, icon: '📦' },
    { label: 'Matches', value: analytics?.totalMatches || 0, icon: '🔗' },
    { label: 'Food Saved (kg)', value: analytics?.foodSaved || 0, icon: '🌱' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of ZeroWaste Connect platform activity</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card">
            <span className="icon">{kpi.icon}</span>
            <div className="label">{kpi.label}</div>
            <div className="value">{kpi.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="two-column">
        {/* Recent Food Listings */}
        <div className="content-card">
          <h5>Recent Food Listings</h5>
          {recentFood.length === 0 ? (
            <div className="empty-state">No food listings yet</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFood.map((food) => (
                    <tr key={food.id}>
                      <td>{food.name}</td>
                      <td>{food.quantity}</td>
                      <td>{food.category}</td>
                      <td>
                        <span className={`badge badge-${food.status === 'available' ? 'success' : 'warning'}`}>
                          {food.status || 'available'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Matches */}
        <div className="content-card">
          <h5>Recent Matches</h5>
          {recentMatches.length === 0 ? (
            <div className="empty-state">No matches yet</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Match ID</th>
                    <th>Food ID</th>
                    <th>NGO ID</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((match) => (
                    <tr key={match.id}>
                      <td>#{match.id}</td>
                      <td>{match.foodId}</td>
                      <td>{match.ngoId}</td>
                      <td>{match.matchScore?.toFixed(2) || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
