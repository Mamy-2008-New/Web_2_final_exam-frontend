import { useState } from 'react';
import QuestionEditor from './QuestionEditor';

export default function AdminExams() {
  const [exams, setExams] = useState([
    { id: 1, name: 'Examen Final Web 2', course_name: 'Développement Web', start_date: '2026-01-01T00:00', end_date: '2026-12-31T23:59' }
  ]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const [name, setName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!name || !courseName || !startDate || !endDate) return;

    const newExam = {
      id: Date.now(),
      name,
      course_name: courseName,
      start_date: startDate,
      end_date: endDate
    };

    setExams([...exams, newExam]);
    setName('');
    setCourseName('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div>
      <div className="card">
        <h3>Créer un nouvel examen</h3>
        <form onSubmit={handleCreateExam}>
          <div className="form-group">
            <label>Titre de l'examen :</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: QCM React & Node.js" required />
          </div>
          <div className="form-group">
            <label>Matière / Cours :</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="ex: Web 2" required />
          </div>
          <div className="form-group">
            <label>Date de début :</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Date de fin :</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Créer l'examen</button>
        </form>
      </div>

      <div className="card">
        <h3>Examens existants</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Matière</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td><strong>{exam.name}</strong></td>
                  <td>{exam.course_name}</td>
                  <td>{new Date(exam.start_date).toLocaleString()}</td>
                  <td>{new Date(exam.end_date).toLocaleString()}</td>
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