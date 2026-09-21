import { createContext, useContext, useMemo, useState } from 'react';
import {
  login as loginRequest,
  register as registerRequest,
} from '../api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'zw_token';
const USER_KEY = 'zw_user';


function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw ? JSON.parse(raw) : null;

  } catch {
    return null;
  }
}


export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(
    () => readStoredUser()
  );


  const persist = (data) => {

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(data)
    );

    setToken(data.token);
    setUser(data);
  };


  const login = async (payload) => {

    const { data } =
      await loginRequest(payload);

    persist(data);

    return data;
  };


  const register = async (payload) => {

    const { data } =
      await registerRequest(payload);

    persist(data);

    return data;
  };


  const logout = () => {

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };


  const value = useMemo(
    () => ({
      token,
      user,

      isAuthenticated:
        Boolean(token && user),

      isRestaurant:
        user?.role === 'RESTAURANT',

      isNgo:
        user?.role === 'NGO',

      login,
      register,
      logout,
    }),

    [token, user]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    );
  }

  return context;
}