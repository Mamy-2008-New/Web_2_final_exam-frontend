import { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { fetchWithAuth } from '../../api/client';
import AdminStudents from './AdminStudents';
import AdminExams from './AdminExams';

export default function AdminDashboard() {
const [stats, setStats] = useState({ students: 0, courses: 0, exams: 0 });

useEffect(() => {
    fetchWithAuth('/api/admin/stats').then(setStats).catch(() => {});
}, []);

return (
    <div style={{ padding: '20px' }}>
    <h1>Espace Administrateur</h1>
    <nav style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <Link to="/admin/students">Gestion Étudiants</Link>
        <Link to="/admin/exams">Gestion Examens & Questions</Link>
    </nav>

    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div>Étudiants : <strong>{stats.students}</strong></div>
        <div>Cours : <strong>{stats.courses}</strong></div>
        <div>Examens : <strong>{stats.exams}</strong></div>
    </div>

    <Routes>
        <Route path="students" element={<AdminStudents />} />
        <Route path="exams" element={<AdminExams />} />
    </Routes>
    </div>
);
}