import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { client } from '../../api/client';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchExamData = async () => {
      try {
        setError('');
        const data = await client(`/api/my/exams/${id}`);
        if (isMounted) {
          setExam(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Impossible de charger l'examen.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExamData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleOptionChange = (questionId, choiceId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir soumettre vos réponses ? Cette action est définitive (une seule tentative)."
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError('');

      // RG-05: partial submission is allowed — unanswered questions are sent
      // with choice_id: null rather than omitted, so the backend can still
      // account for them in max_score.
      const payload = (exam?.questions || []).map((q) => ({
        question_id: q.id,
        choice_id: answers[q.id] ?? null,
      }));

      const response = await client(`/api/my/exams/${id}/submit`, {
        method: 'POST',
        body: { answers: payload },
      });

      navigate(`/student/exam/${id}/correction`, { 
        state: { result: response } 
      });
    } catch (err) {
      setError(err.message || "Erreur lors de la soumission de l'examen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <p>Chargement de l'examen...</p>
        </main>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <div className="card">
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <button className="btn btn-secondary mt-1" onClick={() => navigate('/student')}>
              Retour à la liste
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card card-hero">
          <h2>{exam?.name || exam?.title || `Examen #${id}`}</h2>
          <p>{exam?.description || 'Répondez aux questions ci-dessous puis validez votre copie.'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {exam?.questions?.map((q, index) => (
            <div key={q.id} className="question-block">
              <div className="question-title">
                Question {index + 1} : {q.statement} ({q.points || 1} pts)
              </div>

              <div>
                {q.choices?.map((choice) => (
                  <label key={choice.id} className="choice-option">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={choice.id}
                      checked={answers[q.id] === choice.id}
                      onChange={() => handleOptionChange(q.id, choice.id)}
                    />
                    {choice.statement || choice.text}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="button-group">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/student')}
              disabled={submitting}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Envoi en cours...' : "Soumettre l'examen"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}