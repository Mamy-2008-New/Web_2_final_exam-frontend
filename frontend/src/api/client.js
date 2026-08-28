export async function fetchWithAuth(endpoint) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (endpoint.includes('/api/my/exams')) {
    return [
      { id: 1, name: 'Examen Final Web 2', course_name: 'Développement Web', start_date: '2026-01-01', end_date: '2026-12-31' },
      { id: 2, name: 'QCM JavaScript Async', course_name: 'JS Avancé', start_date: '2026-01-01', end_date: '2026-12-31' }
    ];
  }

  if (endpoint.includes('/api/my/results')) {
    return {
      average: 14.5,
      results: [
        { examId: 1, examTitle: 'Examen Final Web 2', score: 15, totalPoints: 20 },
        { examId: 2, examTitle: 'QCM JavaScript Async', score: 14, totalPoints: 20 }
      ]
    };
  }

  if (endpoint.includes('/api/admin/stats')) {
    return { students: 3, courses: 2, exams: 2 };
  }

  return {};
}