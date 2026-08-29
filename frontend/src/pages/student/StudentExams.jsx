import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { client } from '../../api/client';

export default function StudentExams() {
  const navigate = useNavigate();
  const [availableExams, setAvailableExams] = useState([]);
  const [completedExams, setCompletedExams] = useState([]);
  const [average, setAverage] = useState(0);
  const [activeTab, setActiveTab] = useState('available');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadStudentData = async () => {
      try {
        setError('');

        const [examsData, resultsData] = await Promise.all([
          client('/api/my/exams'),
          client('/api/my/results'),
        ]);

        if (!isMounted) return;

        setAvailableExams(Array.isArray(examsData) ? examsData : []);
        setCompletedExams(Array.isArray(resultsData?.results) ? resultsData.results : []);
        setAverage(Number(resultsData?.average ?? 0));
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Impossible de charger les données étudiant.');
        }
      }
    };

    loadStudentData();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayAverage = Number.isFinite(average) ? `${average.toFixed(1)} / 20` : '—';

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
            <div className="stat-value stat-primary">{availableExams.length} Examen{availableExams.length > 1 ? 's' : ''}</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">COMPLÉTÉS</span>
            <div className="stat-value stat-success">{completedExams.length} Examen{completedExams.length > 1 ? 's' : ''}</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">MOYENNE GÉNÉRALE</span>
            <div className="stat-value stat-purple">{displayAverage}</div>
          </div>
        </div>

        <div className="card">
          <div className="tab-navigation">
            <button
              type="button"
              className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => setActiveTab('available')}
            >
              Examens disponibles
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Examens terminés
            </button>
          </div>

          {activeTab === 'available' ? (
            <>
              <h3>Examens attribués</h3>
              <div className="exam-list">
                {availableExams.length === 0 ? (
                  <p>Aucun examen disponible pour le moment.</p>
                ) : (
                  availableExams.map((exam) => (
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
            </>
          ) : (
            <>
              <h3>Historique des examens</h3>
              <div className="exam-list">
                {completedExams.length === 0 ? (
                  <p>Vous n'avez encore terminé aucun examen.</p>
                ) : (
                  completedExams.map((exam) => (
                    <div key={exam.id} className="exam-item completed">
                      <div>
                        <div className="exam-header">
                          <h4>{exam.exam_title}</h4>
                          <span className="badge badge-success">Terminé</span>
                        </div>
                        <p className="text-muted">
                          Soumis le {exam.submitted_at ? new Date(exam.submitted_at).toLocaleString() : '—'}
                        </p>
                      </div>

                      <div>
                        <span className="score-display">Note : {Number(exam.score ?? 0)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}