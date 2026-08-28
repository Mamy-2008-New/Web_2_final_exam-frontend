import { useState } from 'react';
import Navbar from '../../components/Navbar';
import AdminExams from './AdminExams';
import AdminStudents from './AdminStudents';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('exams');

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <h2>Espace d'Administration</h2>
        
        <div className="tab-navigation">
          <button 
            className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('exams')}
          >
            Gestion des Examens
          </button>
          <button 
            className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('students')}
          >
            Gestion des Étudiants
          </button>
        </div>

        {activeTab === 'exams' && <AdminExams />}
        {activeTab === 'students' && <AdminStudents />}
      </main>
    </div>
  );
}