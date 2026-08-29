import { useState, useEffect } from 'react';
import { client } from '../../api/client';
import QuestionEditor from './QuestionEditor';

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const loadCourses = async () => {
    const data = await client('/api/courses');
    const list = Array.isArray(data?.data) ? data.data : [];
    setCourses(list);
    if (!courseId && list[0]) {
      setCourseId(String(list[0].id));
    }
  };

  const loadExams = async () => {
    const data = await client('/api/exams');
    setExams(Array.isArray(data?.data) ? data.data : []);
  };

  useEffect(() => {
    Promise.all([loadCourses(), loadExams()]).catch((err) => setError(err.message || 'Erreur de chargement des examens.'));
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!name || !courseId || !startDate || !endDate) return;

    try {
      setError('');
      await client('/api/exams', {
        method: 'POST',
        body: JSON.stringify({
          course_id: Number(courseId),
          title: name,
          description: '',
          start_at: new Date(startDate).toISOString(),
          end_at: new Date(endDate).toISOString(),
        }),
      });

      setName('');
      setCourseId(courses[0] ? String(courses[0].id) : '');
      setStartDate('');
      setEndDate('');
      await loadExams();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'examen.');
    }
  };

  return (
    <div className="admin-layout">
      <div className="card admin-panel">
        <div className="panel-header">
          <h3>Créer un nouvel examen</h3>
        </div>
        {error && <div className="alert alert-danger mb-2">{error}</div>}
        <form onSubmit={handleCreateExam} className="admin-form-grid">
          <div className="form-group">
            <label>Titre de l'examen</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: QCM React & Node.js" required />
          </div>
          <div className="form-group">
            <label>Matière / Cours</label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              {!courses.length && <option value="">Aucun cours disponible</option>}
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date de début</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date de fin</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <div className="form-submit-row">
            <button type="submit" className="btn btn-primary" disabled={!courses.length}>Créer l'examen</button>
          </div>
        </form>
      </div>

      <div className="card admin-panel">
        <div className="panel-header">
          <h3>Examens existants</h3>
        </div>
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
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td><strong>{exam.title}</strong></td>
                  <td>{exam.course_id}</td>
                  <td>{exam.start_at ? new Date(exam.start_at).toLocaleString() : '—'}</td>
                  <td>{exam.end_at ? new Date(exam.end_at).toLocaleString() : '—'}</td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setSelectedExamId(selectedExamId === exam.id ? null : exam.id)}
                    >
                      {selectedExamId === exam.id ? 'Fermer' : 'Gérer les questions'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedExamId && <QuestionEditor examId={selectedExamId} />}
    </div>
  );
}