import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import StudentExams from './pages/student/StudentExams';
import TakeExam from './pages/student/TakeExam';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student" element={<StudentExams />} />
        <Route path="/student/exam/:id" element={<TakeExam />} />
      </Routes>
    </BrowserRouter>
  );
}