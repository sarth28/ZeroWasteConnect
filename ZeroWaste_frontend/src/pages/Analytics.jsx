import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  getAnalytics,
  getRestaurants,
  getNGOs,
  getFoodListings,
  getMatches
} from '../api';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const navigate = useNavigate();

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
        const [
          analyticsRes,
          restaurantsRes,
          ngosRes,
          foodRes,
          matchesRes
        ] = await Promise.all([
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

  // --- 1. KPI CARDS ---
  const kpis = [
    {
      label: 'Active Restaurants',
      value: analytics?.restaurants || 0,
      icon: ''
    },
    {
      label: 'Partner NGOs',
      value: analytics?.ngos || 0,
      icon: ''
    },
    {
      label: 'Food Listings',
      value: analytics?.foodListings || 0,
      icon: ''
    },
    {
      label: 'Matches Completed',
      value: analytics?.matches || 0,
      icon: ''
    },
    {
      label: 'Food Saved (kg)',
      value: analytics?.foodSavedKg || 0,
      icon: ''
    },
  ];

  // --- 2. CHART: SUPPLY VS DEMAND BY CATEGORY ---
  const allCategories = [
    'Baked Goods',
    'Prepared Meals',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Canned Goods'
  ];

  const categorySupply = {};
  const categoryDemand = {};

  allCategories.forEach((cat) => {
    categorySupply[cat] = 0;
    categoryDemand[cat] = 0;
  });

  foodListings.forEach((f) => {
    const cat = f.category || 'Other';
    categorySupply[cat] =
      (categorySupply[cat] || 0) + (Number(f.quantity) || 0);
  });

  ngos.forEach((n) => {
    const pref = n.categoryPreference || 'Other';

    if (pref === 'Any') {
      allCategories.forEach((cat) => {
        categoryDemand[cat] =
          (categoryDemand[cat] || 0) +
          Math.round(
            (Number(n.currentDemand) || 0) / allCategories.length
          );
      });
    } else {
      categoryDemand[pref] =
        (categoryDemand[pref] || 0) +
        (Number(n.currentDemand) || 0);
    }
  });

  const supplyDemandData = {
    labels: allCategories,
    datasets: [
      {
        label: 'Food Supply Available (Units)',
        data: allCategories.map((c) => categorySupply[c] || 0),
        backgroundColor: '#4caf50',
        borderRadius: 6,
      },
      {
        label: 'NGO Active Demand (Units)',
        data: allCategories.map((c) => categoryDemand[c] || 0),
        backgroundColor: '#ff9800',
        borderRadius: 6,
      },
    ],
  };

  const supplyDemandOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Food Surplus vs. NGO Demand by Category',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // --- 3. CHART: CATEGORY DISTRIBUTION (PIE) ---
  const categoryCount = {};

  foodListings.forEach((food) => {
    const cat = food.category || 'Other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const pieData = {
    labels: Object.keys(categoryCount).length
      ? Object.keys(categoryCount)
      : ['No Data'],
    datasets: [
      {
        data: Object.keys(categoryCount).length
          ? Object.values(categoryCount)
          : [1],
        backgroundColor: [
          '#2e7d32',
          '#43a047',
          '#66bb6a',
          '#81c784',
          '#a5d6a7',
          '#c8e6c9',
          '#b0bec5',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Listing Breakdown by Category',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
  };

  // --- 4. CHART: MATCH SCORE QUALITY DISTRIBUTION ---
  const scoreBuckets = {
    '0-25%': 0,
    '26-50%': 0,
    '51-75%': 0,
    '76-100%': 0
  };

  matches.forEach((m) => {
    const score = Number(m.matchScore) || 0;

    if (score <= 25) {
      scoreBuckets['0-25%']++;
    } else if (score <= 50) {
      scoreBuckets['26-50%']++;
    } else if (score <= 75) {
      scoreBuckets['51-75%']++;
    } else {
      scoreBuckets['76-100%']++;
    }
  });

  const qualityScoreData = {
    labels: Object.keys(scoreBuckets),
    datasets: [
      {
        label: 'Number of Matches',
        data: Object.values(scoreBuckets),
        backgroundColor: [
          '#ef5350',
          '#ffb74d',
          '#66bb6a',
          '#2e7d32'
        ],
        borderRadius: 6,
      },
    ],
  };

  const qualityScoreOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Match Quality Distribution (Algorithm Confidence)',
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      },
    },
  };

  // --- 5. FOOD RESCUE RECOVERY RATE (DOUGHNUT) ---
  const matchedFoodIds = new Set(
    matches.map((m) => m.foodListingId)
  );

  let matchedUnits = 0;
  let uncollectedUnits = 0;

  foodListings.forEach((item) => {
    const qty = Number(item.quantity) || 0;

    if (
      matchedFoodIds.has(item.id) ||
      (item.status &&
        item.status.toUpperCase() === 'MATCHED')
    ) {
      matchedUnits += qty;
    } else {
      uncollectedUnits += qty;
    }
  });

  const recoveryData = {
    labels: [
      'Rescued / Matched Units',
      'Unclaimed Surplus Units'
    ],
    datasets: [
      {
        data:
          matchedUnits === 0 && uncollectedUnits === 0
            ? [1, 0]
            : [matchedUnits, uncollectedUnits],
        backgroundColor: ['#2e7d32', '#ef5350'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const recoveryRatePct =
    matchedUnits + uncollectedUnits > 0
      ? Math.round(
          (matchedUnits /
            (matchedUnits + uncollectedUnits)) *
            100
        )
      : 0;

  const recoveryOptions = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: `Surplus Recovery Rate: ${recoveryRatePct}%`,
        font: { size: 14, weight: 'bold' },
        color: '#1b5e20',
      },
    },
  };

  return (
    <div className="analytics-page">

      {/* =========================
          ANALYTICS NAVBAR
      ========================= */}
      <nav className="analytics-navbar">

        <div
          className="analytics-brand"
          onClick={() => navigate('/')}
        >
          <span className="analytics-brand-icon">🌱</span>
          <span>ZeroWaste Connect</span>
        </div>

        <button
          type="button"
          className="analytics-home-button"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>

      </nav>


      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="page-header">

        <div className="page-header-text">

          <span className="page-header-label">
            PLATFORM OVERVIEW
          </span>

          <h1>
            Platform Analytics
          </h1>

          <p>
            Monitor food recovery, donations, matches, and
            supply-demand activity across ZeroWaste Connect.
          </p>

        </div>

        <div className="page-header-icon">
          📊
        </div>

      </div>


      {/* =========================
          KPI CARDS
      ========================= */}
      <div className="kpi-grid">

        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card">

            <span className="icon">
              {kpi.icon}
            </span>

            <div className="label">
              {kpi.label}
            </div>

            <div className="value">
              {kpi.value.toLocaleString()}
            </div>

          </div>
        ))}

      </div>


      {/* =========================
          ROW 1
          RECOVERY + CATEGORY
      ========================= */}
      <div className="two-column">

        <div className="content-card circular-chart">
          <Doughnut
            data={recoveryData}
            options={recoveryOptions}
          />
        </div>

        <div className="content-card circular-chart">
          <Pie
            data={pieData}
            options={pieOptions}
          />
        </div>

      </div>


      {/* =========================
          ROW 2
          MATCH QUALITY + SUPPLY/DEMAND
      ========================= */}
      <div className="two-column">

        <div className="content-card analytics-chart">
          <Bar
            data={qualityScoreData}
            options={qualityScoreOptions}
          />
        </div>

        <div className="content-card analytics-chart">
          <Bar
            data={supplyDemandData}
            options={supplyDemandOptions}
          />
        </div>

      </div>


      {/* =========================
          DATA TABLES
      ========================= */}
      <div className="two-column">

        {/* TOP RESTAURANTS */}
        <div className="content-card analytics-chart">

          <h5>
            Top Contributing Restaurants
          </h5>

          <p className="table-subtitle">
            Total quantity donated
          </p>

          <div className="table-responsive">

            <table className="table">

              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Listings</th>
                  <th>Total Units</th>
                </tr>
              </thead>

              <tbody>

                {restaurants.slice(0, 5).map((r) => {

                  const items = foodListings.filter(
                    (f) => f.restaurantId === r.id
                  );

                  const totalQty = items.reduce(
                    (sum, item) =>
                      sum + (Number(item.quantity) || 0),
                    0
                  );

                  return (
                    <tr key={r.id}>

                      <td>
                        <strong>{r.name}</strong>
                      </td>

                      <td>
                        {items.length}
                      </td>

                      <td>
                        {totalQty} units
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        </div>


        {/* NGO SUMMARY */}
        <div className="content-card analytics-chart">

          <h5>
            NGO Demand & Capacity Summary
          </h5>

          <p className="table-subtitle">
            Current requirements across partner NGOs
          </p>

          <div className="table-responsive">

            <table className="table">

              <thead>
                <tr>
                  <th>NGO</th>
                  <th>Preference</th>
                  <th>Capacity</th>
                  <th>Demand</th>
                </tr>
              </thead>

              <tbody>

                {ngos.slice(0, 5).map((ngo) => (

                  <tr key={ngo.id}>

                    <td>
                      <strong>{ngo.name}</strong>
                    </td>

                    <td>
                      <span className="badge badge-info">
                        {ngo.categoryPreference}
                      </span>
                    </td>

                    <td>
                      {ngo.capacity}
                    </td>

                    <td>
                      {ngo.currentDemand}
                    </td>

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