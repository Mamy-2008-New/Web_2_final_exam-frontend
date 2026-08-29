import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { client } from '../../api/client';

export default function StudentExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    client('/api/my/exams')
      .then((data) => setExams(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || 'Impossible de charger les examens.'));
  }, []);

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
            <div className="stat-value stat-primary">{exams.length} Examen{exams.length > 1 ? 's' : ''}</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">COMPLÉTÉS</span>
            <div className="stat-value stat-success">0 Examen</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">MOYENNE GÉNÉRALE</span>
            <div className="stat-value stat-purple">—</div>
          </div>
        </div>

        <div className="card">
          <h3>Examens attribués</h3>
          <div className="exam-list">
            {exams.length === 0 ? (
              <p>Aucun examen disponible pour le moment.</p>
            ) : (
              exams.map((exam) => (
                <div key={exam.id} className="exam-item">
                  <div>
                    <div className="exam-header">
                      <h4>{exam.title || exam.name}</h4>
                      <span className="badge badge-course">{exam.course_name}</span>
                    </div>
                    <p className="text-muted">
                      {exam.start_at ? new Date(exam.start_at).toLocaleString() : '—'} → {exam.end_at ? new Date(exam.end_at).toLocaleString() : '—'}
                    </p>
                  </div>

                  <div>
                    <button className="btn btn-primary" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                      Commencer l'épreuve →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}