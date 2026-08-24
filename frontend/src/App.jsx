import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import StudentExams from './pages/student/StudentExams';
import TakeExam from './pages/student/TakeExam';
import ExamResult from './pages/student/ExamResult';
import StudentHistory from './pages/student/StudentHistory';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Routes Étudiant */}
        <Route path="/student" element={<StudentExams />} />
        <Route path="/student/exam/:id" element={<TakeExam />} />
        <Route path="/student/result/:id" element={<ExamResult />} />
        <Route path="/student/history" element={<StudentHistory />} />

        {/* Routes Admin */}
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}