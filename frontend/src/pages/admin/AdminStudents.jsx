import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([
    { id: 2, email: 'etudiant1@examen.com', active: true, registeredAt: '2026-02-10' },
    { id: 3, email: 'etudiant2@examen.com', active: true, registeredAt: '2026-02-12' },
    { id: 4, email: 'etudiant.suspendu@examen.com', active: false, registeredAt: '2026-02-15' }
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const toggleStudentStatus = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    const newStudent = {
      id: Date.now(),
      email: newEmail,
      active: true,
      registeredAt: new Date().toISOString().split('T')[0]
    };

    setStudents([...students, newStudent]);
    setNewEmail('');
    setNewPassword('');
  };

  return (
    <div>
      <div className="card">
        <h3>Ajouter un nouvel étudiant</h3>
        <form onSubmit={handleAddStudent} className="form-grid">
          <div className="form-group">
            <label>Email de l'étudiant :</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="etudiant@examen.com" required />
          </div>
          <div className="form-group">
            <label>Mot de passe initial :</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary">Créer le compte</button>
        </form>
      </div>

      <div className="card">
        <h3>Liste des étudiants inscrits</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Adresse Email</th>
                <th>Statut</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td><strong>{student.email}</strong></td>
                  <td>
                    <span className={`badge ${student.active ? 'badge-success' : 'badge-danger'}`}>
                      {student.active ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td>{student.registeredAt}</td>
                  <td className="table-actions">
                    <button 
                      className={`btn btn-sm ${student.active ? 'btn-danger' : 'btn-primary'}`} 
                      onClick={() => toggleStudentStatus(student.id)}
                    >
                      {student.active ? 'Suspendre' : 'Réactiver'}
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary" 
                      onClick={() => navigate('/admin/exams/1/results')}
                    >
                      Voir notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}