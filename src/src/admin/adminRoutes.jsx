import { Routes, Route } from 'react-router-dom';
import RequireAdmin from './requireAdmin.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminLogin from './AdminLogin.jsx';
import DashboardPage from './DashboardPage.jsx';
import HeroSlidesPage from './heroSlides/HeroSlidesPage.jsx';
import ServicesList from './pages/Services/ServicesList.jsx';
import AdminCoursesList from './pages/Courses/AdminCoursesList.jsx';
import PartnersList from './pages/Partners/PartnersList.jsx';
import AdminCertificationList from './pages/Certification/AdminCertificationList.jsx';
import PagesPage from './pages/PagesPage.jsx';
import ContactsPage from './pages/ContactsPage.jsx';
import UsersList from './pages/Users/UsersList.jsx';
import CourseRegistrationsList from './pages/CourseRegistrations/CourseRegistrationsList.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="hero-slides/*" element={<HeroSlidesPage />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/:id" element={<ServicesList />} />
          <Route path="courses" element={<AdminCoursesList />} />
          <Route path="courses/:id" element={<AdminCoursesList />} />
          <Route path="partners" element={<PartnersList />} />
          <Route path="partners/:id" element={<PartnersList />} />
          <Route path="certification" element={<AdminCertificationList />} />
          <Route path="certification/:id" element={<AdminCertificationList />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="users" element={<UsersList />} />
          <Route path="course-registrations" element={<CourseRegistrationsList />} />
        </Route>
      </Route>
    </Routes>
  );
}

