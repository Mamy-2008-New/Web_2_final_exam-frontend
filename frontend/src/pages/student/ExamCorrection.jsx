import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function ExamCorrection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state?.result;
  const corrections = Array.isArray(result?.corrections) ? result.corrections : [];

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card card-hero">
          <h2>Résultat et Correction - Examen #{id}</h2>
          {result ? (
            <div style={{ marginTop: '10px' }}>
              <p className="stat-value stat-purple mb-1">
                Note : {result.score} / {result.max_score ?? 20}
              </p>
              <p>Examen soumis avec succès.</p>
            </div>
          ) : (
            <p>Détails de la correction disponibles ci-dessous.</p>
          )}
        </div>

        {corrections.length > 0 && (
          <div className="card mb-2">
            <h3>Correction détaillée</h3>
            {corrections.map((item, idx) => (
              <div key={item.question_id || idx} className="question-block" style={{ marginTop: '15px' }}>
                <div className="question-title">
                  {idx + 1}. {item.statement}
                </div>
                <p style={{ color: item.is_correct ? 'var(--success, green)' : 'var(--danger, red)' }}>
                  {item.is_correct ? '✓ Correct' : '✗ Incorrect'} ({item.points} pts)
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