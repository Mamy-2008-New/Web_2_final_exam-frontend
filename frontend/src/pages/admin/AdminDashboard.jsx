import { useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminExams from './AdminExams';
import AdminStudents from './AdminStudents';
import AdminCourses from './AdminCourses';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('exams');

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card card-hero mb-2">
          <h2>Espace d'Administration</h2>
          <p>Gérez les examens, la base de cours et la liste des étudiants inscrits.</p>
        </div>

        <div className="tab-navigation mb-2" style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('exams')}
          >
            Examens
          </button>
          <button
            className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('courses')}
          >
            Cours
          </button>
          <button
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('students')}
          >
            Étudiants
          </button>
        </div>

        {activeTab === 'exams' && <AdminExams />}
        {activeTab === 'courses' && <AdminCourses />}
        {activeTab === 'students' && <AdminStudents />}
      </main>
    </div>
  );
}