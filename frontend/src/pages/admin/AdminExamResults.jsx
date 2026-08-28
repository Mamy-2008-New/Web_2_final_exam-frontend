import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { client } from '../../api/client';

export default function AdminExamResults() {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    client(`/api/exams/${id}/results`)
      .then(setResults)
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/admin">← Retour aux examens</Link>
      <h2>Résultats des étudiants pour l'examen</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length === 0 ? (
        <p>Aucun étudiant n'a encore passé cet examen.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Étudiant (Email)</th>
              <th>Note</th>
              <th>Statut</th>
              <th>Date de soumission</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => {
              const isPassing = res.score >= 10;
              return (
                <tr key={res.id}>
                  <td>{res.email}</td>
                  <td>{res.score} pts</td>
                  <td style={{ color: isPassing ? 'green' : 'red', fontWeight: 'bold' }}>
                    {isPassing ? 'Admis' : 'Non admis'}
                  </td>
                  <td>{new Date(res.submitted_at).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
