import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import StudentExams from './pages/student/StudentExams';
import TakeExam from './pages/student/TakeExam';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExamResults from './pages/admin/AdminExamResults';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentExams />} />
        <Route path="/student/exam/:id" element={<TakeExam />} />
        
        {}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/exams/:id/results" element={<AdminExamResults />} />
      </Routes>
    </BrowserRouter>
  );
}