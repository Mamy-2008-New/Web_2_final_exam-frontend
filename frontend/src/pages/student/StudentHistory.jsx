import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../api/client';

export default function StudentHistory() {
const [history, setHistory] = useState({ results: [], average: 0 });

useEffect(() => {
    fetchWithAuth('/api/my/results').then(setHistory);
}, []);

return (
    <div style={{ padding: '20px' }}>
    <h1>Historique de mes résultats</h1>
    <h3>Moyenne générale : {history.average.toFixed(2)} / 20</h3>
    <ul>
        {history.results.map((res) => (
        <li key={res.examId} style={{ marginBottom: '8px' }}>
            <strong>{res.examTitle}</strong> : {res.score} / {res.totalPoints}
            <Link to={`/student/result/${res.examId}`} style={{ marginLeft: '10px' }}>
            Voir la correction
            </Link>
        </li>
        ))}
    </ul>
    </div>
);
}