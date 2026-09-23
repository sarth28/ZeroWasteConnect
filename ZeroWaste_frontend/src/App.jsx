import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Authenticated application */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >

            {/* Restaurant */}
            <Route
              path="/restaurant/dashboard"
              element={
                <ProtectedRoute allowedRole="RESTAURANT">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/restaurant/food-listings"
              element={
                <ProtectedRoute allowedRole="RESTAURANT">
                  <FoodListings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/restaurant/matching"
              element={
                <ProtectedRoute allowedRole="RESTAURANT">
                  <Matching />
                </ProtectedRoute>
              }
            />

            {/* NGO */}
            <Route
              path="/ngo/dashboard"
              element={
                <ProtectedRoute allowedRole="NGO">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo/food-listings"
              element={
                <ProtectedRoute allowedRole="NGO">
                  <FoodListings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo/requests"
              element={
                <ProtectedRoute allowedRole="NGO">
                  <Requests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo/matching"
              element={
                <ProtectedRoute allowedRole="NGO">
                  <Matching />
                </ProtectedRoute>
              }
            />

          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;