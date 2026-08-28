import Navbar from '../../components/Navbar';

export default function StudentHistory() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="card">
          <h3>Historique de mes résultats et moyennes</h3>
          <div className="stat-value stat-purple mb-1">Moyenne Générale : 15.5 / 20</div>
          
          <table style={{ width: '100%', marginTop: '15px' }}>
            <thead>
              <tr>
                <th>Examen</th>
                <th>Matière</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Examen Final Web 2</td>
                <td>Développement Web</td>
                <td><strong>16 / 20</strong></td>
                <td>12/02/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}