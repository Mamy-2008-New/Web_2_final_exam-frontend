import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExamResults from './pages/admin/AdminExamResults';

import StudentExams from './pages/student/StudentExams';
import TakeExam from './pages/student/TakeExam';
import ExamCorrection from './pages/student/ExamCorrection';
import StudentHistory from './pages/student/StudentHistory';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {}
        <Route path="/" element={<LoginPage />} />

        {}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/exams/:id/results" element={<AdminExamResults />} />

        {}
        <Route path="/student" element={<StudentExams />} />
        <Route path="/student/exam/:id" element={<TakeExam />} />
        <Route path="/student/exam/:id/correction" element={<ExamCorrection />} />
        <Route path="/student/history" element={<StudentHistory />} />
      </Routes>
    </BrowserRouter>
  );
}