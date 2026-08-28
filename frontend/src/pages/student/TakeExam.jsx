import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function TakeExam() {
  const params = useParams();
  const id = params.id || '1';
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const examData = {
    title: `Examen Final Web 2 (#${id})`,
    questions: [
      {
        id: 1,
        statement: 'Quel statut HTTP indique une création réussie d\'une ressource côté serveur ?',
        choices: [
          { id: 101, statement: '200 OK' },
          { id: 102, statement: '201 Created' },
          { id: 103, statement: '400 Bad Request' },
          { id: 104, statement: '500 Internal Error' }
        ]
      },
      {
        id: 2,
        statement: 'Dans une architecture REST, quelle méthode est idempotente et utilisée pour remplacer une ressource ?',
        choices: [
          { id: 201, statement: 'POST' },
          { id: 202, statement: 'PUT' },
          { id: 203, statement: 'PATCH' }
        ]
      }
    ]
  };

  const handleSelect = (questionId, choiceId) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: choiceId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Examen #${id} soumis avec succès !`);
    navigate('/student');
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <h2>{examData.title}</h2>
          <p className="text-muted">
            Veuillez répondre à toutes les questions avant de valider votre copie.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {examData.questions.map((q, idx) => (
            <div key={q.id} className="question-block">
              <div className="question-title">Question {idx + 1} : {q.statement}</div>
              {q.choices.map((c) => (
                <label key={c.id} className="choice-option">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={selectedAnswers[q.id] === c.id}
                    onChange={() => handleSelect(q.id, c.id)}
                  />
                  {c.statement}
                </label>
              ))}
            </div>
          ))}

          <div className="button-group">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/student')}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Soumettre l'examen
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}