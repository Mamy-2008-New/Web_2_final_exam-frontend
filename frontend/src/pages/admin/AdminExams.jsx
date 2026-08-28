import { useEffect, useState } from 'react';
import { client } from '../../api/client';
import QuestionEditor from './QuestionEditor';

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadExams = async () => {
    try {
      setError('');
      // GET /api/exams -> paginated { data, page, limit, total, total_pages }
      const result = await client('/api/exams?limit=100');
      setExams(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des examens');
    }
  };

  const loadCourses = async () => {
    try {
      const result = await client('/api/courses?limit=100');
      setCourses(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cours');
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadExams(), loadCourses()]);
      setLoading(false);
    })();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!title || !courseId || !startDate || !endDate) return;

    try {
      setFormError('');
      setSubmitting(true);
      await client('/api/exams', {
        method: 'POST',
        body: {
          course_id: Number(courseId),
          title,
          description,
          // datetime-local has no timezone; Date() reads it as local time
          // and toISOString() converts it to the UTC string the backend expects.
          start_at: new Date(startDate).toISOString(),
          end_at: new Date(endDate).toISOString(),
        },
      });
      setTitle('');
      setCourseId('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      await loadExams();
    } catch (err) {
      // e.g. 400 if end_at <= start_at, or course_id doesn't exist
      setFormError(err.message || "Erreur lors de la création de l'examen");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cet examen ?')) return;
    try {
      setError('');
      await client(`/api/exams/${id}`, { method: 'DELETE' });
      if (selectedExamId === id) setSelectedExamId(null);
      await loadExams();
    } catch (err) {
      // 409 if the exam already has attempts
      setError(err.message || 'Impossible de supprimer cet examen.');
    }
  };

  const courseName = (course_id) => courses.find((c) => c.id === course_id)?.name || `#${course_id}`;

  return (
    <div>
      <div className="card">
        <h3>Créer un nouvel examen</h3>
        {formError && <div className="alert alert-danger mb-2">{formError}</div>}
        <form onSubmit={handleCreateExam}>
          <div className="form-group">
            <label>Titre de l'examen :</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex: QCM React & Node.js" required />
          </div>
          <div className="form-group">
            <label>Cours :</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">-- Sélectionner un cours --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} — {course.name}
                </option>
              ))}
            </select>
            {courses.length === 0 && (
              <p className="text-muted">Aucun cours disponible. Créez d'abord un cours dans l'onglet "Cours".</p>
            )}
          </div>
          <div className="form-group">
            <label>Description :</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="2" />
          </div>
          <div className="form-group">
            <label>Date de début :</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date de fin :</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Création...' : "Créer l'examen"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Examens existants</h3>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        {loading ? (
          <p>Chargement des examens...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Cours</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Aucun examen trouvé.</td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id}>
                      <td><strong>{exam.title}</strong></td>
                      <td>{courseName(exam.course_id)}</td>
                      <td>{new Date(exam.start_at).toLocaleString()}</td>
                      <td>{new Date(exam.end_at).toLocaleString()}</td>
                      <td className="table-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setSelectedExamId(selectedExamId === exam.id ? null : exam.id)}
                        >
                          {selectedExamId === exam.id ? 'Fermer' : 'Gérer les questions'}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteExam(exam.id)}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedExamId && <QuestionEditor examId={selectedExamId} />}
    </div>
  );
}
