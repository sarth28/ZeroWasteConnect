import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Analytics from './pages/Analytics';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FoodListings from './pages/FoodListings';
import Matching from './pages/Matching';
import Requests from './pages/Requests';
import Forbidden from './pages/Forbidden';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/403" element={<Forbidden />} />

          {/* Restaurant Protected Routes */}
          <Route
            path="/restaurant"
            element={
              <ProtectedRoute allowedRole="RESTAURANT">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/restaurant/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="food-listings" element={<FoodListings />} />
            <Route path="matching" element={<Matching />} />
          </Route>

          {/* NGO Protected Routes */}
          <Route
            path="/ngo"
            element={
              <ProtectedRoute allowedRole="NGO">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/ngo/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="food-listings" element={<FoodListings />} />
            <Route path="requests" element={<Requests />} />
            <Route path="matching" element={<Matching />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;