import { useState } from 'react';
import { fetchWithAuth } from '../../api/client';

export default function QuestionEditor({ examId, isLocked, onQuestionAdded }) {
const [text, setText] = useState('');
const [points, setPoints] = useState(1);
const [choices, setChoices] = useState([
{ text: '', isCorrect: true },
{ text: '', isCorrect: false }
]);
const [error, setError] = useState('');

if (isLocked) {
return (
    <div style={{ padding: '10px', background: '#ffe6e6', color: '#900' }}>
    🔒 Les questions de cet examen ne peuvent plus être modifiées ni ajoutées car des étudiants ont déjà soumis une tentative.
    </div>
);
}

const handleChoiceChange = (index, val) => {
const updated = [...choices];
updated[index].text = val;
setChoices(updated);
};

const setCorrectChoice = (correctIndex) => {
setChoices(choices.map((c, i) => ({ ...c, isCorrect: i === correctIndex })));
};

const addChoice = () => {
if (choices.length < 6) setChoices([...choices, { text: '', isCorrect: false }]);
};

const handleSubmit = async (e) => {
e.preventDefault();
setError('');
try {
    await fetchWithAuth(`/api/exams/${examId}/questions`, {
    method: 'POST',
    body: JSON.stringify({ text, points, choices })
    });
    setText('');
    onQuestionAdded();
} catch (err) {
    setError(err.message);
}
};

return (
<form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px' }}>
    <h4>Ajouter une Question</h4>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <div>
    <label>Énoncé : </label>
    <input value={text} onChange={(e) => setText(e.target.value)} required />
    </div>
    <div>
    <label>Points : </label>
    <input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min="1" />
    </div>

    <h5>Choix (cochez l'unique bonne réponse) :</h5>
    {choices.map((choice, i) => (
    <div key={i}>
        <input
        type="radio"
        name="correctChoice"
        checked={choice.isCorrect}
        onChange={() => setCorrectChoice(i)}
        />
        <input
        type="text"
        value={choice.text}
        onChange={(e) => handleChoiceChange(i, e.target.value)}
        required
        />
    </div>
    ))}
    {choices.length < 6 && <button type="button" onClick={addChoice}>+ Ajouter un choix</button>}
    <br /><br />
    <button type="submit">Enregistrer la Question</button>
</form>
);
}