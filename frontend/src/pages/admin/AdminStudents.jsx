import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { client } from '../../api/client';

export default function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStudents = async (targetPage = page) => {
    try {
      setError('');
      setLoading(true);
      // GET /api/students?page=&limit= -> { data, page, limit, total, total_pages }
      const result = await client(`/api/students?page=${targetPage}&limit=10`);
      setStudents(Array.isArray(result?.data) ? result.data : []);
      setTotalPages(result?.total_pages || 1);
      setPage(result?.page || targetPage);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStudentStatus = async (student) => {
    try {
      setError('');
      const updated = await client(`/api/students/${student.id}/active`, {
        method: 'PATCH',
        body: { active: !student.active },
      });
      setStudents((prev) => prev.map((s) => (s.id === student.id ? updated : s)));
    } catch (err) {
      setError(err.message || 'Impossible de changer le statut de cet étudiant.');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPassword) return;

    try {
      setFormError('');
      setSubmitting(true);
      await client('/api/students', {
        method: 'POST',
        body: { name: newName, email: newEmail, password: newPassword },
      });
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      await loadStudents(1);
    } catch (err) {
      // e.g. 409 if the email is already in use, or 400 if password < 6 chars
      setFormError(err.message || "Erreur lors de la création de l'étudiant");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Ajouter un nouvel étudiant</h3>
        {formError && <div className="alert alert-danger mb-2">{formError}</div>}
        <form onSubmit={handleAddStudent} className="form-grid">
          <div className="form-group">
            <label>Nom complet :</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Email de l'étudiant :</label>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="etudiant@examen.com" required />
          </div>
          <div className="form-group">
            <label>Mot de passe initial (min. 6 caractères) :</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Création...' : 'Créer le compte'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Liste des étudiants inscrits</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}

        {loading ? (
          <p>Chargement des étudiants...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Adresse Email</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Aucun étudiant trouvé.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.id}</td>
                      <td>{student.name}</td>
                      <td><strong>{student.email}</strong></td>
                      <td>
                        <span className={`badge ${student.active ? 'badge-success' : 'badge-danger'}`}>
                          {student.active ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="table-actions">
                        <button
                          className={`btn btn-sm ${student.active ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => toggleStudentStatus(student)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="table-actions mt-1" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-secondary"
              disabled={page <= 1}
              onClick={() => loadStudents(page - 1)}
            >
              Précédent
            </button>
            <span>Page {page} / {totalPages}</span>
            <button
              className="btn btn-sm btn-secondary"
              disabled={page >= totalPages}
              onClick={() => loadStudents(page + 1)}
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
