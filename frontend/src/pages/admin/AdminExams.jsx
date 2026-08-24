import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../api/client';
import QuestionEditor from './QuestionEditor';

export default function AdminExams() {
const [exams, setExams] = useState([]);
const [selectedExam, setSelectedExam] = useState(null);
const [error, setError] = useState('');

useEffect(() => {
    fetchWithAuth('/api/exams')
    .then(setExams)
    .catch((err) => setError(err.message));
}, []);

return (
    <div>
    <h2>Gestion des Examens & Questions</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}

    <div style={{ display: 'flex', gap: '20px' }}>
        <ul>
        {exams.map((exam) => (
            <li key={exam.id} style={{ marginBottom: '10px' }}>
            <strong>{exam.title}</strong>
            <button onClick={() => setSelectedExam(exam)} style={{ marginLeft: '10px' }}>
                Éditer questions
            </button>
            </li>
        ))}
        </ul>

        {selectedExam && (
        <div style={{ flex: 1 }}>
            <h3>Questions pour : {selectedExam.title}</h3>
            <QuestionEditor
            examId={selectedExam.id}
            isLocked={selectedExam.hasAttempts}
            onQuestionAdded={() => {}}
            />
        </div>
        )}
    </div>
    </div>
);
}