import { useState } from 'react';

export default function QuestionEditor({ examId }) {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      statement: 'Quelle méthode HTTP est utilisée pour créer une ressource ?',
      points: 2,
      choices: [
        { id: 101, statement: 'GET', is_correct: false },
        { id: 102, statement: 'POST', is_correct: true },
        { id: 103, statement: 'DELETE', is_correct: false }
      ]
    }
  ]);

  const [statement, setStatement] = useState('');
  const [points, setPoints] = useState(2);
  const [choices, setChoices] = useState([
    { statement: '', is_correct: false },
    { statement: '', is_correct: false }
  ]);

  const handleChoiceChange = (index, text) => {
    const updated = [...choices];
    updated[index].statement = text;
    setChoices(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = choices.map((c, i) => ({ ...c, is_correct: i === index }));
    setChoices(updated);
  };

  const addChoiceField = () => {
    setChoices([...choices, { statement: '', is_correct: false }]);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!statement || choices.some((c) => !c.statement)) return;

    const newQuestion = {
      id: Date.now(),
      statement,
      points: Number(points),
      choices: choices.map((c, i) => ({ id: Date.now() + i, ...c }))
    };

    setQuestions([...questions, newQuestion]);
    setStatement('');
    setPoints(2);
    setChoices([
      { statement: '', is_correct: false },
      { statement: '', is_correct: false }
    ]);
  };

  return (
    <div className="card card-editor">
      <h3>Gestion des questions pour l'examen #{examId}</h3>

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
          <label>Options de réponse (Cocher la bonne réponse) :</label>
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
                value={choice.statement} 
                onChange={(e) => handleChoiceChange(index, e.target.value)} 
                placeholder={`Choix ${index + 1}`} 
                required 
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-1" onClick={addChoiceField}>
            + Ajouter un choix
          </button>
        </div>

        <button type="submit" className="btn btn-primary">Enregistrer la question</button>
      </form>

      <h4>Questions configurées :</h4>
      {questions.map((q, idx) => (
        <div key={q.id} className="question-block">
          <div className="question-title">{idx + 1}. {q.statement} ({q.points} pts)</div>
          <ul>
            {q.choices.map((c) => (
              <li key={c.id} className={`choice-option ${c.is_correct ? 'is-correct' : ''}`}>
                {c.statement} {c.is_correct && '✓ (Bonne réponse)'}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}