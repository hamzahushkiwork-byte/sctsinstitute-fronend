import { Routes, Route } from 'react-router-dom';
import RouteGuard from '../utils/routeGuard.jsx';
import AdminLayout from '../layout/AdminLayout.jsx';
import Login from '../pages/Login.jsx';
import DashboardHome from '../pages/DashboardHome.jsx';
import HeroSlidesList from '../pages/HeroSlides/HeroSlidesList.jsx';
import ServicesList from '../pages/Services/ServicesList.jsx';
import CoursesList from '../pages/Courses/CoursesList.jsx';
import PartnersList from '../pages/Partners/PartnersList.jsx';
import PagesList from '../pages/Pages/PagesList.jsx';
import ContactsList from '../pages/Contacts/ContactsList.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <RouteGuard>
            <AdminLayout />
          </RouteGuard>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="hero-slides" element={<HeroSlidesList />} />
        <Route path="hero-slides/:id" element={<HeroSlidesList />} />
        <Route path="services" element={<ServicesList />} />
        <Route path="services/:id" element={<ServicesList />} />
        <Route path="courses" element={<CoursesList />} />
        <Route path="courses/:id" element={<CoursesList />} />
        <Route path="partners" element={<PartnersList />} />
        <Route path="partners/:id" element={<PartnersList />} />
        <Route path="pages" element={<PagesList />} />
        <Route path="pages/:key" element={<PagesList />} />
        <Route path="contacts" element={<ContactsList />} />
      </Route>
    </Routes>
  );
}
