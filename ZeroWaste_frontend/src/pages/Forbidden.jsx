import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Forbidden() {
  const navigate = useNavigate();
  const { isNgo, isRestaurant } = useAuth();

  const handleReturn = () => {
    if (isNgo) {
      navigate('/ngo/dashboard', { replace: true });
    } else if (isRestaurant) {
      navigate('/restaurant/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="content-card text-center"
        style={{
          maxWidth: '520px',
          padding: '3rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>🔍</div> */}
        <img src="https://static.thenounproject.com/png/sad-laptop-icon-1713647-512.png" width="200px" height="200px"></img>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--primary-green-dark, #1b5e20)',
          }}
        >
          404
        </h1>

        <h4 className="mt-3 mb-2" style={{ color: 'var(--text-dark, #1a1a1a)' }}>
          Sorry, this page isn't available
        </h4>

        <p className="text-muted" style={{ lineHeight: 1.6 }}>
          We couldn't find the page you were looking for. The link you followed may be broken, or the page may have been moved.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={handleReturn}
          >
            Go to My Dashboard
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/', { replace: true })}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forbidden;