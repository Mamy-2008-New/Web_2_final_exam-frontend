import { useState, useEffect } from 'react';
import { client } from '../../api/client';

export default function QuestionEditor({ examId }) {
  const [questions, setQuestions] = useState([]);
  const [statement, setStatement] = useState('');
  const [points, setPoints] = useState(2);
  const [choices, setChoices] = useState([
    { text: '', is_correct: false },
    { text: '', is_correct: false }
  ]);
  const [error, setError] = useState('');

  const loadQuestions = async () => {
    const data = await client(`/api/exams/${examId}/questions`);
    setQuestions(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!examId) return;
    loadQuestions().catch((err) => setError(err.message || 'Erreur de chargement des questions.'));
  }, [examId]);

  const handleChoiceChange = (index, text) => {
    const updated = [...choices];
    updated[index].text = text;
    setChoices(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = choices.map((c, i) => ({ ...c, is_correct: i === index }));
    setChoices(updated);
  };

  const addChoiceField = () => {
    setChoices([...choices, { text: '', is_correct: false }]);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!statement || choices.some((c) => !c.text.trim())) return;

    try {
      setError('');
      await client(`/api/exams/${examId}/questions`, {
        method: 'POST',
        body: JSON.stringify({
          statement,
          points: Number(points),
          choices: choices.map((c) => ({ text: c.text.trim(), is_correct: !!c.is_correct })),
        }),
      });
      setStatement('');
      setPoints(2);
      setChoices([
        { text: '', is_correct: false },
        { text: '', is_correct: false }
      ]);
      await loadQuestions();
    } catch (err) {
      setError(err.message || 'Impossible d\'ajouter la question.');
    }
  };

  return (
    <div className="card card-editor admin-panel">
      <div className="panel-header panel-header-stack">
        <h3>Gestion des questions pour l'examen #{examId}</h3>
      </div>
      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <form onSubmit={handleAddQuestion} className="question-form">
        <div className="form-group">
          <label>Intitulé de la question</label>
          <input type="text" value={statement} onChange={(e) => setStatement(e.target.value)} placeholder="ex: Que signifie SQL ?" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nombre de points</label>
            <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} min="1" required />
          </div>
        </div>

        <div className="form-group">
          <label>Options de réponse</label>
          <div className="choice-manager">
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
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary mt-1" onClick={addChoiceField}>
            + Ajouter un choix
          </button>
        </div>

        <button type="submit" className="btn btn-primary">Enregistrer la question</button>
      </form>

      <div className="question-section">
        <h4>Questions configurées</h4>
        {questions.length === 0 ? (
          <p className="empty-state">Aucune question enregistrée pour cet examen.</p>
        ) : questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <div className="question-title">{idx + 1}. {q.statement} <span>({q.points} pts)</span></div>
            <ul className="choice-list">
              {q.choices?.map((c) => (
                <li key={c.id} className={`choice-option ${c.is_correct ? 'is-correct' : ''}`}>
                  {c.text || c.statement} {c.is_correct && <span>✓ Bonne réponse</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}