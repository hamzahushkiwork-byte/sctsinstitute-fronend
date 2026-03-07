import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import PageLoader from './components/PageLoader.jsx'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import CoursesPrograms from './pages/CoursesPrograms'
import Courses from './pages/CoursesPage'
import CourseDetails from './pages/CourseDetails'
import Certification from './pages/CertificationPage'
import CertificationDetails from './pages/CertificationDetails'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminRoutes from './admin/adminRoutes.jsx'

// Component to handle admin route redirects
function AdminRouteHandler() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader isVisible={true} />;
  }

  if (isAuthenticated && isAdmin) {
    return <AdminRoutes />;
  }

  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time for assets and auth
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <PageLoader isVisible={isInitialLoading} />
      <div className="App">
        <Routes>
          {/* Auth routes - no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRouteHandler />} />

          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/courses-programs" element={<CoursesPrograms />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/certification" element={<Certification />} />
            <Route path="/certification/:slug" element={<CertificationDetails />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
