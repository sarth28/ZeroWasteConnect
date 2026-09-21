import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">

        <h1>ZeroWaste Connect</h1>

        <p className="text-muted mb-4">
          Connecting surplus food from restaurants
          with NGOs that need it.
        </p>

        <div className="d-flex gap-3 justify-content-center">

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate('/login')}
          >
            Create Account
          </button>

        </div>

      </div>
    </div>
  );
}

export default Landing;