import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function StudentExams() {
  const navigate = useNavigate();
  const [exams] = useState([
    { id: 1, name: 'Examen Final Web 2', course_name: 'Développement Web', questionsCount: 5, duration: '45 min', status: 'AVAILABLE' },
    { id: 2, name: 'QCM JavaScript Async & API', course_name: 'JS Avancé', questionsCount: 10, duration: '30 min', status: 'AVAILABLE' },
    { id: 3, name: 'Bases de données SQL', course_name: 'Architecture DB', questionsCount: 8, duration: '60 min', status: 'COMPLETED', score: 16 }
  ]);

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <div className="card card-hero">
          <h2>Espace Étudiant</h2>
          <p>Bienvenue sur votre plateforme d'évaluations en ligne. Choisissez un examen disponible pour démarrer la session.</p>
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <span className="stat-label">DISPONIBLES</span>
            <div className="stat-value stat-primary">2 Examens</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">COMPLÉTÉS</span>
            <div className="stat-value stat-success">1 Examen</div>
          </div>
          <div className="card stat-card">
            <span className="stat-label">MOYENNE GÉNÉRALE</span>
            <div className="stat-value stat-purple">16.0 / 20</div>
          </div>
        </div>

        <div className="card">
          <h3>Examens attribués</h3>
          <div className="exam-list">
            {exams.map((exam) => (
              <div key={exam.id} className={`exam-item ${exam.status === 'COMPLETED' ? 'completed' : ''}`}>
                <div>
                  <div className="exam-header">
                    <h4>{exam.name}</h4>
                    <span className="badge badge-course">{exam.course_name}</span>
                  </div>
                  <p className="text-muted">
                    {exam.questionsCount} questions • Durée estimée : {exam.duration}
                  </p>
                </div>

                <div>
                  {exam.status === 'COMPLETED' ? (
                    <div className="text-right">
                      <span className="badge badge-success mb-1">Complété</span>
                      <strong className="score-display">Note : {exam.score}/20</strong>
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                      Commencer l'épreuve →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}