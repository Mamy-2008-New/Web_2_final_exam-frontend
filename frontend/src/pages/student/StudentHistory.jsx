import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { client } from '../../api/client';

export default function StudentHistory() {
  const [results, setResults] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    client('/api/my/results')
      .then((data) => {
        if (!isMounted) return;
        // GET /api/my/results -> { results: [{ id, score, submitted_at, exam_title }], average }
        setResults(Array.isArray(data?.results) ? data.results : []);
        setAverage(Number(data?.average || 0));
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Impossible de charger votre historique.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <h3>Historique de mes résultats et moyennes</h3>

          {error && <div className="alert alert-danger mb-2">{error}</div>}

          <div className="stat-value stat-purple mb-1">Moyenne Générale : {average.toFixed(1)}</div>

          {loading ? (
            <p>Chargement de l'historique...</p>
          ) : results.length === 0 ? (
            <p className="text-muted">Aucun examen passé pour le moment.</p>
          ) : (
            <table style={{ width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th>Examen</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id}>
                    <td>{r.exam_title}</td>
                    <td><strong>{r.score}</strong></td>
                    <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
