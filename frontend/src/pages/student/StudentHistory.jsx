import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { client } from '../../api/client';

export default function StudentHistory() {
  const navigate = useNavigate();
  const [results, setResults] = useState({ results: [], average: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      try {
        const data = await client('/api/my/results');
        if (!isMounted) return;

        setResults({
          results: Array.isArray(data?.results) ? data.results : [],
          average: Number(data?.average ?? 0),
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Impossible de charger l’historique.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => navigate('/student')}>
              ← Retour aux examens
            </button>
          </div>

          <h3 style={{ marginTop: '20px' }}>Historique de mes résultats et moyennes</h3>
          <div className="stat-value stat-purple mb-1">
            Moyenne Générale : {loading ? '…' : `${Number(results.average || 0).toFixed(1)} / 20`}
          </div>

          {error && <div className="alert alert-danger mt-1">{error}</div>}

          <table style={{ width: '100%', marginTop: '15px' }}>
            <thead>
              <tr>
                <th>Examen</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {!loading && results.results.length === 0 ? (
                <tr>
                  <td colSpan="3">Aucun examen terminé pour le moment.</td>
                </tr>
              ) : (
                results.results.map((exam) => (
                  <tr key={exam.id}>
                    <td>{exam.exam_title}</td>
                    <td><strong>{Number(exam.score ?? 0)}</strong></td>
                    <td>{exam.submitted_at ? new Date(exam.submitted_at).toLocaleString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}