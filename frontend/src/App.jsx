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
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id/results"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminExamResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:id"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam/:id/correction"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <ExamCorrection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}