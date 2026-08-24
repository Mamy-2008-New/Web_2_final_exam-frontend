import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../api/client';

export default function StudentExams() {
const [exams, setExams] = useState([]);
const [error, setError] = useState('');

useEffect(() => {
    fetchWithAuth('/api/my/exams')
    .then(setExams)
    .catch((err) => setError(err.message));
}, []);

return (
    <div style={{ padding: '20px' }}>
    <h1>Examens disponibles</h1>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {exams.length === 0 ? (
        <p>Aucun examen disponible pour le moment.</p>
    ) : (
        <ul>
        {exams.map((exam) => (
            <li key={exam.id} style={{ marginBottom: '10px' }}>
            <strong>{exam.title}</strong> (Fin : {new Date(exam.endDate).toLocaleString()})
            <Link to={`/student/exam/${exam.id}`} style={{ marginLeft: '10px' }}>
                Passer l'examen
            </Link>
            </li>
        ))}
        </ul>
    )}
    </div>
);
}