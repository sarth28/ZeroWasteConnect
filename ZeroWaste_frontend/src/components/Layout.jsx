import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    user,
    isRestaurant,
    isNgo,
    logout,
  } = useAuth();

  const navItems = isRestaurant
    ? [
        {
          path: '/restaurant/dashboard',
          label: 'Dashboard',
          icon: '📊',
        },
        {
          path: '/restaurant/food-listings',
          label: 'Food Listings',
          icon: '📦',
        },
        {
          path: '/restaurant/matching',
          label: 'Matching',
          icon: '🔗',
        },
      ]
    : isNgo
      ? [
          {
            path: '/ngo/dashboard',
            label: 'Dashboard',
            icon: '📊',
          },
          {
            path: '/ngo/food-listings',
            label: 'Available Food',
            icon: '📦',
          },
          {
            path: '/ngo/requests',
            label: 'Requests',
            icon: '🙏',
          },
          {
            path: '/ngo/matching',
            label: 'Matching',
            icon: '🔗',
          },
        ]
      : [];

  return (
    <div className="app-layout">

      <div className="mobile-header">
        <button
          className="hamburger"
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
          ZeroWaste Connect
        </h4>
      </div>

      <aside
        className={`sidebar ${
          sidebarOpen ? 'open' : ''
        }`}
      >

        <div className="sidebar-header">
          <h3>ZeroWaste Connect</h3>

          <div className="subtitle">
            {isRestaurant
              ? 'Restaurant portal'
              : isNgo
                ? 'NGO portal'
                : 'Food Donation Platform'}
          </div>
        </div>

        <nav className="sidebar-nav">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `nav-item ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}

        </nav>

        <div className="sidebar-user">

          <div className="sidebar-user-name">
            {user?.name}
          </div>

          <div className="sidebar-user-meta">
            {user?.email}
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-light mt-2 w-100"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}

export default Layout;