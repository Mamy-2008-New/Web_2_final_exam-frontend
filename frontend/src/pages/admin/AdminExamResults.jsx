import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client } from '../../api/client';

export default function AdminExamResults() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // GET /api/exams/:id/results -> { exam_id, average_score, attempt_count, students: [...] }
    client(`/api/exams/${id}/results`)
      .then((data) => {
        if (isMounted) setSummary(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const students = summary?.students || [];

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/admin">← Retour aux examens</Link>
      <h2>Résultats des étudiants pour l'examen</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Chargement des résultats...</p>
      ) : (
        <>
          {summary && (
            <div className="stats-grid mb-2">
              <div className="card stat-card">
                <span className="stat-label">TENTATIVES</span>
                <div className="stat-value stat-primary">{summary.attempt_count}</div>
              </div>
              <div className="card stat-card">
                <span className="stat-label">MOYENNE</span>
                <div className="stat-value stat-purple">{summary.average_score}</div>
              </div>
            </div>
          )}

          {students.length === 0 ? (
            <p>Aucun étudiant n'a encore passé cet examen.</p>
          ) : (
            <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Note</th>
                  <th>Statut</th>
                  <th>Date de soumission</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const isPassing = s.score >= 10;
                  return (
                    <tr key={s.student_id}>
                      <td>{s.name}</td>
                      <td>{s.score} pts</td>
                      <td style={{ color: isPassing ? 'green' : 'red', fontWeight: 'bold' }}>
                        {isPassing ? 'Admis' : 'Non admis'}
                      </td>
                      <td>{new Date(s.submitted_at).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
