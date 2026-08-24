import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentExams from './pages/student/StudentExams';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/student/*" element={<StudentExams />} />
      </Routes>
    </BrowserRouter>
  );
}