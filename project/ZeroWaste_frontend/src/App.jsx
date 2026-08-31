import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import NGOs from './pages/NGOs';
import FoodListings from './pages/FoodListings';
import Matching from './pages/Matching';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="ngos" element={<NGOs />} />
          <Route path="food-listings" element={<FoodListings />} />
          <Route path="matching" element={<Matching />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
