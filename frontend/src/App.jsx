import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseViewer from './pages/student/CourseViewer';
import AllCourses from './pages/student/AllCourses'; 
import CourseDetails from './pages/student/CourseDetails';
import Checkout from './pages/student/Checkout';

function AppContent() {
  const location = useLocation();
  const isCoursePage = location.pathname.startsWith('/student/course/') || location.pathname.startsWith('/course/');

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {!isCoursePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/homepage" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="text-center p-12 glass rounded-3xl">
              <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
              <p className="text-slate-600">Unauthorized Access</p>
              <Link to="/" className="btn-primary inline-block mt-6">Go Home</Link>
            </div>
          </div>
        } />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseViewer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
