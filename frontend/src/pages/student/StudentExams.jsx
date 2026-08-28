import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { client } from '../../api/client';

export default function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [history, setHistory] = useState({ results: [], average: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setError('');
        // GET /api/my/exams already excludes exams the student attempted (RG-02)
        // and only includes exams within their open window (RG-03).
        const [availableExams, results] = await Promise.all([
          client('/api/my/exams'),
          client('/api/my/results'),
        ]);
        if (isMounted) {
          setExams(Array.isArray(availableExams) ? availableExams : []);
          setHistory(results || { results: [], average: 0 });
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Impossible de charger vos examens.');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const completedCount = history.results?.length || 0;

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div className="card card-hero">
          <h2>Espace Étudiant</h2>
          <p>Bienvenue sur votre plateforme d'évaluations en ligne. Choisissez un examen disponible pour démarrer la session.</p>
        </div>

        {error && <div className="alert alert-danger mb-2">{error}</div>}

        <div className="stats-grid">
          <div className="card stat-card">
            <span className="stat-label">DISPONIBLES</span>
            <div className="stat-value stat-primary">{exams.length} Examen{exams.length !== 1 ? 's' : ''}</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">COMPLÉTÉS</span>
            <div className="stat-value stat-success">{completedCount} Examen{completedCount !== 1 ? 's' : ''}</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">MOYENNE GÉNÉRALE</span>
            <div className="stat-value stat-purple">{Number(history.average || 0).toFixed(1)}</div>
          </div>
        </div>

        <div className="card">
          <h3>Examens disponibles</h3>
          {loading ? (
            <p>Chargement des examens...</p>
          ) : exams.length === 0 ? (
            <p className="text-muted">Aucun examen disponible pour le moment.</p>
          ) : (
            <div className="exam-list">
              {exams.map((exam) => (
                <div key={exam.id} className="exam-item">
                  <div>
                    <div className="exam-header">
                      <h4>{exam.title}</h4>
                      <span className="badge badge-course">{exam.course_name}</span>
                    </div>
                    <p className="text-muted">
                      Disponible jusqu'au {new Date(exam.end_at).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <button className="btn btn-primary" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                      Commencer l'épreuve →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
