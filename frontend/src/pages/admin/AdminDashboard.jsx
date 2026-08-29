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
      <main className="main-content admin-shell">
        <div className="card card-hero admin-hero">
          <div>
            <span className="eyebrow">Administration</span>
            <h2>Espace d'Administration</h2>
          </div>
          <p>Gérez les examens, la base de cours et la liste des étudiants inscrits.</p>
        </div>

        <div className="tab-navigation admin-tabs">
          <button
            className={`tab-button ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            Examens
          </button>
          <button
            className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Cours
          </button>
          <button
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
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