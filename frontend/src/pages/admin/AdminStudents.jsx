import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../../api/client';

export default function AdminStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const loadStudents = async () => {
    const data = await client('/api/students?page=1&limit=100');
    setStudents(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => {
    loadStudents().catch((err) => setError(err.message || 'Erreur de chargement des étudiants.'));
  }, []);

  const toggleStudentStatus = async (id, active) => {
    try {
      setError('');
      await client(`/api/students/${id}/active`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !active }),
      });
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Impossible de modifier le statut.');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    try {
      setError('');
      await client('/api/students', {
        method: 'POST',
        body: JSON.stringify({
          name: newEmail.split('@')[0],
          email: newEmail,
          password: newPassword,
        }),
      });
      setNewEmail('');
      setNewPassword('');
      await loadStudents();
    } catch (err) {
      setError(err.message || 'Impossible de créer l\'étudiant.');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Ajouter un nouvel étudiant</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
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
                  <td>{student.created_at ? new Date(student.created_at).toISOString().split('T')[0] : '—'}</td>
                  <td className="table-actions">
                    <button 
                      className={`btn btn-sm ${student.active ? 'btn-danger' : 'btn-primary'}`} 
                      onClick={() => toggleStudentStatus(student.id, student.active)}
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