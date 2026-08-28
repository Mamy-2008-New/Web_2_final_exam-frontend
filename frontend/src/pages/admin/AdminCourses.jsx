import { useState, useEffect } from 'react';
import { client } from '../../api/client';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadCourses = async () => {
    try {
      setError('');
      const data = await client('/api/courses');
      // GET /api/courses returns the paginated shape { data, page, limit, total, total_pages }
      setCourses(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cours');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        setError('');
        const data = await client('/api/courses');
        if (isMounted) {
          setCourses(Array.isArray(data?.data) ? data.data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Erreur lors du chargement des cours');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setError('');
      // Backend requires code + name (CourseService.validate); description is optional.
      await client('/api/courses', {
        method: 'POST',
        body: { code, name, description },
      });
      setCode('');
      setName('');
      setDescription('');
      await reloadCourses();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du cours');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce cours ?')) return;
    try {
      setError('');
      await client(`/api/courses/${id}`, { method: 'DELETE' });
      await reloadCourses();
    } catch (err) {
      // 409 if the course still has exams attached (RG-09).
      setError(err.message || 'Impossible de supprimer ce cours.');
    }
  };

  return (
    <div className="card">
      <h3>Gestion des Cours</h3>

      {error && <div className="alert alert-danger mb-2">{error}</div>}

      <form onSubmit={handleCreateCourse} className="mb-2">
        <div className="form-group mb-1">
          <label>Code du cours (ex. WEB2, PROG2)</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-1">
          <label>Nom du cours</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-1">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Créer le cours
        </button>
      </form>

      <h4>Liste des cours</h4>
      {loading ? (
        <p>Chargement des cours...</p>
      ) : (
        <table style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Aucun cours trouvé.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.code}</td>
                  <td>
                    <strong>{course.name}</strong>
                  </td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
