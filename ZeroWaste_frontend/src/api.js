import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';
const TOKEN_KEY = 'zw_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('zw_user');

      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export const login = (data) =>
  api.post('/auth/login', data);

export const register = (data) =>
  api.post('/auth/register', data);

export const getMe = () =>
  api.get('/auth/me');

export const getRestaurants = () =>
  api.get('/restaurants');

export const createRestaurant = (data) =>
  api.post('/restaurants', data);

export const updateRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data);

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`);

export const getNGOs = () =>
  api.get('/ngos');

export const getNGOById = (id) =>
  api.get(`/ngos/${id}`);

export const createNGO = (data) =>
  api.post('/ngos', data);

export const updateNGO = (id, data) =>
  api.put(`/ngos/${id}`, data);

export const deleteNGO = (id) =>
  api.delete(`/ngos/${id}`);

export const getFoodListings = () =>
  api.get('/food');

export const createFoodListing = (data) =>
  api.post('/food', data);

export const getMatches = () =>
  api.get('/matches');

export const matchFood = (foodId) =>
  api.post(`/matches/match-food/${foodId}`);

export const getAnalytics = () =>
  api.get('/analytics');

export const getDonationRequests = () =>
  api.get('/requests');

export const createDonationRequest = (data) =>
  api.post('/requests', data);

export default api;