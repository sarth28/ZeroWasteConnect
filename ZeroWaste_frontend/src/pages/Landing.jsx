import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="landing-navbar">

        <div
          className="landing-brand"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          🌱 ZeroWaste Connect
        </div>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate('/login')}
          >
            Register
          </button>
        </div>

      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}
      <main>

        <section className="landing-hero">

          <div className="hero-content">

            <div className="hero-badge">
              🌍 Turning surplus into support
            </div>

            <h1>
              Good Food Shouldn't
              <span> Go to Waste.</span>
            </h1>

            <p>
              ZeroWaste Connect bridges the gap between restaurants
              with surplus food and NGOs that can put it to good use.
              Together, we can make every meal count.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="btn btn-success btn-lg"
                onClick={() => navigate('/login')}
              >
                Get Started →
              </button>

              <button
                type="button"
                className="btn btn-outline-success btn-lg"
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }
              >
                How It Works
              </button>

            </div>

          </div>


          {/* Hero Visual */}
          <div className="hero-visual">

            <div className="hero-circle">
              <div className="food-icon">🥗</div>
            </div>

            <div className="floating-card floating-card-top">
              <span>🍎</span>
              <div>
                <strong>Surplus Food</strong>
                <small>Ready to be rescued</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>🤝</span>
              <div>
                <strong>Food Matched</strong>
                <small>Connecting with NGOs</small>
              </div>
            </div>

          </div>

        </section>


        {/* =========================
            PROBLEM / MISSION STRIP
        ========================= */}
        <section className="mission-section">

          <div className="mission-content">

            <div className="mission-icon">
              ♻️
            </div>

            <div>
              <h3>From surplus to shared resources.</h3>
              <p>
                Restaurants often have perfectly usable food left over,
                while communities and NGOs continue to face food shortages.
                ZeroWaste Connect brings these two sides together.
              </p>
            </div>

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}
        <section
          id="how-it-works"
          className="how-it-works-section"
        >

          <div className="section-heading">

            <span>HOW IT WORKS</span>

            <h2>
              Simple connections. Real impact.
            </h2>

            <p>
              We make food redistribution easier by connecting
              restaurants, NGOs, and available food in one place.
            </p>

          </div>


          <div className="steps-container">

            {/* Step 1 */}
            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                🍽️
              </div>

              <h3>Restaurants List</h3>

              <p>
                Restaurants can quickly list surplus food that
                is still safe and suitable for redistribution.
              </p>

            </div>


            <div className="step-arrow">
              →
            </div>


            {/* Step 2 */}
            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                🔗
              </div>

              <h3>Food Gets Matched</h3>

              <p>
                Available food is matched with NGO requirements
                based on factors such as category, quantity and urgency.
              </p>

            </div>


            <div className="step-arrow">
              →
            </div>


            {/* Step 3 */}
            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                🤝
              </div>

              <h3>NGOs Receive</h3>

              <p>
                NGOs can discover suitable donations and coordinate
                redistribution to the people who need them.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            WHY ZERO WASTE CONNECT
        ========================= */}
        <section className="why-section">

          <div className="why-visual">

            <div className="why-main-circle">
              🌱
            </div>

            <div className="why-small-circle circle-one">
              🥕
            </div>

            <div className="why-small-circle circle-two">
              🍞
            </div>

            <div className="why-small-circle circle-three">
              🥛
            </div>

          </div>


          <div className="why-content">

            <span className="section-label">
              WHY ZERO WASTE CONNECT?
            </span>

            <h2>
              Making food redistribution
              <span> easier and smarter.</span>
            </h2>

            <p>
              Food waste is not always caused by a lack of food.
              Often, the challenge is connecting available food
              with organizations that need it at the right time.
            </p>


            <div className="benefit-list">

              <div className="benefit-item">
                <div className="benefit-icon">♻️</div>

                <div>
                  <h4>Reduce Food Waste</h4>
                  <p>
                    Give surplus food a second purpose instead of
                    letting it become waste.
                  </p>
                </div>
              </div>


              <div className="benefit-item">
                <div className="benefit-icon">🤝</div>

                <div>
                  <h4>Connect Communities</h4>
                  <p>
                    Create a direct connection between food providers
                    and organizations serving communities.
                  </p>
                </div>
              </div>


              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>

                <div>
                  <h4>Make Redistribution Easier</h4>
                  <p>
                    Organize listings, requirements and matches
                    through a single platform.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* =========================
            IMPACT PREVIEW
        ========================= */}
        <section className="impact-section">

          <div className="section-heading">

            <span>OUR IMPACT</span>

            <h2>
              Every connection makes a difference.
            </h2>

            <p>
              See how the ZeroWaste Connect network is helping
              move surplus food towards where it is needed.
            </p>

          </div>


          <div className="impact-cards">

            <div className="impact-card">
              <div className="impact-card-icon">
                🍽️
              </div>

              <strong>Restaurants</strong>

              <p>
                Contributing surplus food
              </p>
            </div>


            <div className="impact-card">
              <div className="impact-card-icon">
                🏛️
              </div>

              <strong>NGOs</strong>

              <p>
                Connecting with food donations
              </p>
            </div>


            <div className="impact-card">
              <div className="impact-card-icon">
                📦
              </div>

              <strong>Food Listings</strong>

              <p>
                Surplus food available
              </p>
            </div>


            <div className="impact-card">
              <div className="impact-card-icon">
                🌱
              </div>

              <strong>Food Saved</strong>

              <p>
                Helping reduce food waste
              </p>
            </div>

          </div>


          <button
            type="button"
            className="btn btn-outline-success impact-button"
            onClick={() => navigate('/analytics')}
          >
            Explore Platform Analytics →
          </button>

        </section>


        {/* =========================
            FINAL CTA
        ========================= */}
        <section className="cta-section">

          <div className="cta-content">

            <div className="cta-leaf">
              🌿
            </div>

            <h2>
              Let's make surplus food count.
            </h2>

            <p>
              Whether you're a restaurant with extra food or an NGO
              looking for donations, there's a place for you here.
            </p>

            <button
              type="button"
              className="btn btn-light btn-lg"
              onClick={() => navigate('/login')}
            >
              Join ZeroWaste Connect →
            </button>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="landing-footer">

        <div className="footer-brand">
          🌱 <strong>ZeroWaste Connect</strong>
        </div>

        <p>
          Connecting surplus food with communities that need it.
        </p>

        <div className="footer-bottom">
          <span>
            © 2026 ZeroWaste Connect
          </span>

          <span>
            Built for a more sustainable future.
          </span>
        </div>

      </footer>

    </div>
  );
}

export default Landing;

