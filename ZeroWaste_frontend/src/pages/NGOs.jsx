import {
  useEffect,
  useState
} from 'react';

import {
  getNGOs
} from '../api';


function NGOs() {

  const [ngos, setNGOs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  useEffect(() => {

    loadNGOs();

  }, []);


  const loadNGOs = async () => {

    try {

      const response =
        await getNGOs();

      setNGOs(
        response.data || []
      );

    } catch (err) {

      console.error(err);

      setError(
        'Failed to load NGO directory.'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div>


      <div className="page-header">

        <h1>
          NGO Directory
        </h1>

        <p>
          View NGOs participating in
          ZeroWaste Connect.
        </p>

      </div>


      {error && (

        <div className="alert alert-danger">
          {error}
        </div>

      )}


      <div className="content-card">

        <h5>
          Registered NGOs
          {' '}
          ({ngos.length})
        </h5>


        {loading ? (

          <div className="loading-spinner">

            <div
              className="spinner-border"
              role="status"
            >

              <span className="visually-hidden">
                Loading...
              </span>

            </div>

          </div>

        ) : ngos.length === 0 ? (

          <div className="empty-state">

            No NGOs registered yet.

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table">

              <thead>

                <tr>

                  <th>ID</th>

                  <th>NGO</th>

                  <th>Location</th>

                  <th>Capacity</th>

                  <th>Current Demand</th>

                  <th>Preference</th>

                  <th>Coordinates</th>

                </tr>

              </thead>


              <tbody>

                {ngos.map(
                  (ngo) => (

                    <tr
                      key={ngo.id}
                    >

                      <td>
                        #{ngo.id}
                      </td>

                      <td>

                        <strong>
                          {ngo.name}
                        </strong>

                      </td>

                      <td>
                        {ngo.location ||
                          '-'}
                      </td>

                      <td>
                        {ngo.capacity ?? 0}
                      </td>

                      <td>
                        {ngo.currentDemand ?? 0}
                      </td>

                      <td>

                        <span className="badge badge-info">

                          {ngo.categoryPreference ||
                            'Not set'}

                        </span>

                      </td>

                      <td>

                        <small className="text-muted">

                          {ngo.latitude != null
                            ? Number(
                                ngo.latitude
                              ).toFixed(4)
                            : '-'}

                          ,

                          {' '}

                          {ngo.longitude != null
                            ? Number(
                                ngo.longitude
                              ).toFixed(4)
                            : '-'}

                        </small>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}


export default NGOs;