import { useEffect, useState } from 'react';
import { client } from '../../api/client';

const emptyChoices = () => [
  { text: '', is_correct: false },
  { text: '', is_correct: false },
];

export default function QuestionEditor({ examId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [statement, setStatement] = useState('');
  const [points, setPoints] = useState(2);
  const [choices, setChoices] = useState(emptyChoices());

  const loadQuestions = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await client(`/api/exams/${examId}/questions`);
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  const handleChoiceChange = (index, text) => {
    const updated = [...choices];
    updated[index] = { ...updated[index], text };
    setChoices(updated);
  };

  const handleCorrectChange = (index) => {
    setChoices(choices.map((c, i) => ({ ...c, is_correct: i === index })));
  };

  const addChoiceField = () => {
    if (choices.length >= 6) return; // RG-04: max 6 choices
    setChoices([...choices, { text: '', is_correct: false }]);
  };

  const removeChoiceField = (index) => {
    if (choices.length <= 2) return; // RG-04: min 2 choices
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!statement || choices.some((c) => !c.text.trim())) return;
    if (!choices.some((c) => c.is_correct)) {
      setFormError('Sélectionnez la bonne réponse.');
      return;
    }

    try {
      setFormError('');
      setSubmitting(true);
      await client(`/api/exams/${examId}/questions`, {
        method: 'POST',
        body: { statement, points: Number(points), choices },
      });
      setStatement('');
      setPoints(2);
      setChoices(emptyChoices());
      await loadQuestions();
    } catch (err) {
      // e.g. 409 if the exam already has attempts (RG-08)
      setFormError(err.message || "Erreur lors de l'ajout de la question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Supprimer cette question ?')) return;
    try {
      setError('');
      await client(`/api/questions/${questionId}`, { method: 'DELETE' });
      await loadQuestions();
    } catch (err) {
      setError(err.message || 'Impossible de supprimer cette question.');
    }
  };

  return (
    <div className="card card-editor">
      <h3>Gestion des questions pour l'examen #{examId}</h3>

      {formError && <div className="alert alert-danger mb-2">{formError}</div>}

      <form onSubmit={handleAddQuestion} className="question-form">
        <div className="form-group">
          <label>Intitulé de la question :</label>
          <input type="text" value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="ex: Que signifie SQL ?" required />
        </div>

        <div className="form-group">
          <label>Nombre de points :</label>
          <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} min="1" required />
        </div>

        <div className="form-group">
          <label>Options de réponse (2 à 6, cocher la bonne réponse) :</label>
          {choices.map((choice, index) => (
            <div key={index} className="choice-input-row">
              <input
                type="radio"
                name="correctChoice"
                checked={choice.is_correct}
                onChange={() => handleCorrectChange(index)}
                required
              />
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                placeholder={`Choix ${index + 1}`}
                required
              />
              {choices.length > 2 && (
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => removeChoiceField(index)}>
                  Retirer
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-1" onClick={addChoiceField} disabled={choices.length >= 6}>
            + Ajouter un choix
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Enregistrement...' : 'Enregistrer la question'}
        </button>
      </form>

      <h4>Questions configurées :</h4>
      {error && <div className="alert alert-danger mb-2">{error}</div>}
      {loading ? (
        <p>Chargement des questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-muted">Aucune question pour cet examen.</p>
      ) : (
        questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <div className="question-title">
              {idx + 1}. {q.statement} ({q.points} pts)
              <button className="btn btn-sm btn-danger" style={{ marginLeft: '10px' }} onClick={() => handleDeleteQuestion(q.id)}>
                Supprimer
              </button>
            </div>
            <ul>
              {q.choices.map((c) => (
                <li key={c.id} className={`choice-option ${c.is_correct ? 'is-correct' : ''}`}>
                  {c.text} {c.is_correct && '✓ (Bonne réponse)'}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
