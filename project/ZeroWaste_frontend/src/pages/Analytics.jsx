import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { getAnalytics, getRestaurants, getNGOs, getFoodListings, getMatches } from '../api';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [ngos, setNGOs] = useState([]);
  const [foodListings, setFoodListings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, restaurantsRes, ngosRes, foodRes, matchesRes] = await Promise.all([
          getAnalytics(),
          getRestaurants(),
          getNGOs(),
          getFoodListings(),
          getMatches(),
        ]);
        setAnalytics(analyticsRes.data);
        setRestaurants(restaurantsRes.data);
        setNGOs(ngosRes.data);
        setFoodListings(foodRes.data);
        setMatches(matchesRes.data);
      } catch (err) {
        setError('Failed to load analytics data');
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

  // KPI Cards
  const kpis = [
    { label: 'Total Restaurants', value: analytics?.totalRestaurants || 0, icon: '🍽️' },
    { label: 'Total NGOs', value: analytics?.totalNGOs || 0, icon: '🏛️' },
    { label: 'Food Listings', value: analytics?.totalFoodListings || 0, icon: '📦' },
    { label: 'Matches', value: analytics?.totalMatches || 0, icon: '🔗' },
    { label: 'Food Saved (kg)', value: analytics?.foodSaved || 0, icon: '🌱' },
  ];

  // Category Distribution Chart
  const categoryData = {};
  foodListings.forEach((food) => {
    const cat = food.category || 'Other';
    categoryData[cat] = (categoryData[cat] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        '#2e7d32', '#43a047', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e9',
      ],
      borderWidth: 2,
      borderColor: '#fff',
    }],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Food Category Distribution',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
  };

  // Matches Over Time
  const matchesByDate = {};
  matches.forEach((match) => {
    if (match.matchedTime) {
      const date = new Date(match.matchedTime).toLocaleDateString();
      matchesByDate[date] = (matchesByDate[date] || 0) + 1;
    }
  });

  const lineData = {
    labels: Object.keys(matchesByDate).slice(-7),
    datasets: [{
      label: 'Matches',
      data: Object.values(matchesByDate).slice(-7),
      borderColor: '#2e7d32',
      backgroundColor: 'rgba(46, 125, 50, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Matches Over Time',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  // Summary Bar Chart
  const barData = {
    labels: ['Restaurants', 'NGOs', 'Food Listings', 'Matches'],
    datasets: [{
      label: 'Count',
      data: [
        analytics?.totalRestaurants || 0,
        analytics?.totalNGOs || 0,
        analytics?.totalFoodListings || 0,
        analytics?.totalMatches || 0,
      ],
      backgroundColor: ['#2e7d32', '#43a047', '#66bb6a', '#81c784'],
      borderRadius: 8,
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Platform Overview',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Platform performance metrics and insights</p>
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

      {/* Charts Row 1 */}
      <div className="two-column">
        <div className="content-card">
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="content-card">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="content-card">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Summary Tables */}
      <div className="two-column">
        <div className="content-card">
          <h5>Top Restaurants by Listings</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Listings</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.slice(0, 5).map((r) => {
                  const count = foodListings.filter((f) => f.restaurantId === r.id).length;
                  return (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-card">
          <h5>NGO Capacity Overview</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>NGO</th>
                  <th>Capacity</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {ngos.slice(0, 5).map((ngo) => (
                  <tr key={ngo.id}>
                    <td>{ngo.name}</td>
                    <td>{ngo.capacity}</td>
                    <td>{ngo.currentDemand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
