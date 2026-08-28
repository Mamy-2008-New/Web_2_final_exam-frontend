import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function ExamCorrection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // POST /api/my/exams/:id/submit -> { score, max_score, submitted_at, corrections: [...] }
  const result = location.state?.result;

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card card-hero">
          <h2>Résultat et Correction - Examen #{id}</h2>
          {result ? (
            <div style={{ marginTop: '10px' }}>
              <p className="stat-value stat-purple mb-1">
                Note : {result.score} / {result.max_score}
              </p>
              <p>Soumis le {new Date(result.submitted_at).toLocaleString()}</p>
            </div>
          ) : (
            <p>Aucun résultat à afficher. Retournez à la liste des examens pour en démarrer un.</p>
          )}
        </div>

        {result?.corrections && (
          <div className="card mb-2">
            <h3>Correction détaillée</h3>
            {result.corrections.map((item, idx) => (
              <div key={item.question_id} className="question-block" style={{ marginTop: '15px' }}>
                <div className="question-title">
                  {idx + 1}. {item.statement}
                </div>
                <p style={{ color: item.is_correct ? 'var(--success, green)' : 'var(--danger, red)' }}>
                  {item.is_correct ? `✓ Correct (${item.points} pts)` : `✗ Incorrect (0 / ${item.points} pts)`}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="button-group" style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/student')}>
            Retour aux examens
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/student/history')}>
            Voir mon historique
          </button>
        </div>
      </main>
    </div>
  );
}
