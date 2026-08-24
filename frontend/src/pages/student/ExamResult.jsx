import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { fetchWithAuth } from '../../api/client';

export default function ExamResult() {
const { id } = useParams();
const location = useLocation();
const [result, setResult] = useState(location.state?.resultData || null);
const [error, setError] = useState('');

useEffect(() => {
    if (!result) {
    fetchWithAuth(`/api/my/exams/${id}`)
        .then(setResult)
        .catch((err) => setError(err.message));
    }
}, [id, result]);

if (error) return <p style={{ color: 'red' }}>{error}</p>;
if (!result) return <p>Chargement des résultats...</p>;

return (
    <div style={{ padding: '20px' }}>
    <h1>Résultat de l'examen</h1>
    <h2>Note finale : {result.score} / {result.totalPoints}</h2>

    <h3>Correction détaillée :</h3>
    {result.questions.map((q) => (
        <div key={q.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
        <p><strong>{q.text}</strong> ({q.userPoints} / {q.points} pts)</p>
        <ul>
            {q.choices.map((choice) => {
            const isSelected = choice.id === q.selectedChoiceId;
            const isCorrect = choice.isCorrect;
            let style = {};

            if (isCorrect) style = { color: 'green', fontWeight: 'bold' };
            else if (isSelected && !isCorrect) style = { color: 'red', textDecoration: 'line-through' };

            return (
                <li key={choice.id} style={style}>
                {choice.text} {isSelected && '(Votre réponse)'} {isCorrect && '✓ (Réponse correcte)'}
                </li>
            );
            })}
        </ul>
        </div>
    ))}
    </div>
);
}