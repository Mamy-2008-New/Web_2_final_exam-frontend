import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../api/client';

export default function TakeExam() {
const { id } = useParams();
const navigate = useNavigate();
const [exam, setExam] = useState(null);
const [answers, setAnswers] = useState({});
const [error, setError] = useState('');

useEffect(() => {
fetchWithAuth(`/api/my/exams/${id}`)
    .then(setExam)
    .catch((err) => setError(err.message));
}, [id]);

const handleOptionChange = (questionId, choiceId) => {
setAnswers({ ...answers, [questionId]: choiceId });
};

const handleSubmit = async (e) => {
e.preventDefault();
if (!window.confirm("Êtes-vous sûr de vouloir soumettre l'examen ?")) return;

const payload = {
    choices: Object.values(answers)
};

try {
    const result = await fetchWithAuth(`/api/my/exams/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
    });

    navigate(`/student/result/${id}`, { state: { resultData: result } });
} catch (err) {
    setError(err.message);
}
};

if (error) return <p style={{ color: 'red' }}>{error}</p>;
if (!exam) return <p>Chargement de l'examen...</p>;

return (
<div style={{ padding: '20px' }}>
    <h1>{exam.title}</h1>
    <form onSubmit={handleSubmit}>
    {exam.questions.map((q) => (
        <fieldset key={q.id} style={{ marginBottom: '15px' }}>
        <legend><strong>{q.text}</strong> ({q.points} pt)</legend>
        {q.choices.map((choice) => (
            <div key={choice.id}>
            <label>
                <input
                type="radio"
                name={`question-${q.id}`}
                value={choice.id}
                onChange={() => handleOptionChange(q.id, choice.id)}
                />
                {choice.text}
            </label>
            </div>
        ))}
        </fieldset>
    ))}
    <button type="submit">Soumettre mes réponses</button>
    </form>
</div>
);
}