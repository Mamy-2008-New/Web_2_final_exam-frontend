import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminExamResults from './pages/admin/AdminExamResults';
import StudentExams from './pages/student/StudentExams';
import TakeExam from './pages/student/TakeExam';
import ExamCorrection from './pages/student/ExamCorrection';
import StudentHistory from './pages/student/StudentHistory';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id/results"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminExamResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:id"
          element={
            <ProtectedRoute allowedRole="student">
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:id/correction"
          element={
            <ProtectedRoute allowedRole="student">
              <ExamCorrection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}