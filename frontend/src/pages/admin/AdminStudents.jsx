import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../api/client';

export default function AdminStudents() {
const [students, setStudents] = useState([]);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const loadStudents = () => {
    fetchWithAuth('/api/students')
    .then(setStudents)
    .catch((err) => setError(err.message));
};

useEffect(() => {
    loadStudents();
}, []);

const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
    await fetchWithAuth('/api/students', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    setEmail('');
    setPassword('');
    loadStudents();
    } catch (err) {
    setError(err.message);
    }
};

const toggleStudentStatus = async (id, currentStatus) => {
    try {
    await fetchWithAuth(`/api/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !currentStatus }),
    });
    loadStudents();
    } catch (err) {
    setError(err.message);
    }
};

return (
    <div>
    <h2>Gestion des Étudiants</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}

    <form onSubmit={handleCreateStudent} style={{ marginBottom: '20px' }}>
        <input
        type="email"
        placeholder="Email étudiant"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button type="submit">Créer étudiant</button>
    </form>

    <ul>
        {students.map((s) => (
        <li key={s.id}>
            {s.email} - Status: {s.active ? 'Actif' : 'Suspendu'}
            <button onClick={() => toggleStudentStatus(s.id, s.active)} style={{ marginLeft: '10px' }}>
            {s.active ? 'Suspendre' : 'Activer'}
            </button>
        </li>
        ))}
    </ul>
    </div>
);
}