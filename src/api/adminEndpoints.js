import adminClient from './adminClient.js';

// Hero Slides
export async function fetchAdminHeroSlides() {
  const response = await adminClient.get('/admin/hero-slides');
  return response.data?.data || [];
}

export async function fetchHeroSlide(id) {
  const response = await adminClient.get(`/admin/hero-slides/${id}`);
  return response.data?.data;
}

export async function createHeroSlide(data) {
  const response = await adminClient.post('/admin/hero-slides', data);
  return response.data?.data;
}

export async function updateHeroSlide(id, data) {
  const response = await adminClient.put(`/admin/hero-slides/${id}`, data);
  return response.data?.data;
}

export async function deleteHeroSlide(id) {
  const response = await adminClient.delete(`/admin/hero-slides/${id}`);
  return response.data?.data;
}

// Services
export async function fetchAdminServices() {
  const response = await adminClient.get('/admin/services');
  return response.data?.data || [];
}

export async function fetchService(id) {
  const response = await adminClient.get(`/admin/services/${id}`);
  return response.data?.data;
}

export async function createService(data) {
  const response = await adminClient.post('/admin/services', data);
  return response.data?.data;
}

export async function updateService(id, data) {
  const response = await adminClient.put(`/admin/services/${id}`, data);
  return response.data?.data;
}

export async function deleteService(id) {
  const response = await adminClient.delete(`/admin/services/${id}`);
  return response.data?.data;
}

// Courses
export async function fetchAdminCourses() {
  const response = await adminClient.get('/admin/courses');
  return response.data?.data || [];
}

export async function fetchCourse(id) {
  const response = await adminClient.get(`/admin/courses/${id}`);
  return response.data?.data;
}

export async function createCourse(data) {
  const response = await adminClient.post('/admin/courses', data);
  return response.data?.data;
}

export async function updateCourse(id, data) {
  const response = await adminClient.put(`/admin/courses/${id}`, data);
  return response.data?.data;
}

export async function deleteCourse(id) {
  const response = await adminClient.delete(`/admin/courses/${id}`);
  return response.data?.data;
}

// Course Registrations
export async function fetchCourseRegistrations() {
  const response = await adminClient.get('/admin/course-registrations');
  return response.data?.data || [];
}

// Partners
export async function fetchAdminPartners() {
  const response = await adminClient.get('/admin/partners');
  return response.data?.data || [];
}

export async function fetchPartner(id) {
  const response = await adminClient.get(`/admin/partners/${id}`);
  return response.data?.data;
}

export async function createPartner(data) {
  const response = await adminClient.post('/admin/partners', data);
  return response.data?.data;
}

export async function updatePartner(id, data) {
  const response = await adminClient.put(`/admin/partners/${id}`, data);
  return response.data?.data;
}

export async function deletePartner(id) {
  const response = await adminClient.delete(`/admin/partners/${id}`);
  return response.data?.data;
}

// Pages
export async function fetchAdminPages() {
  const response = await adminClient.get('/admin/pages');
  return response.data?.data || [];
}

export async function fetchPage(key) {
  const response = await adminClient.get(`/admin/pages/${key}`);
  return response.data?.data;
}

export async function createPage(data) {
  const response = await adminClient.post('/admin/pages', data);
  return response.data?.data;
}

export async function updatePage(key, data) {
  const response = await adminClient.put(`/admin/pages/${key}`, data);
  return response.data?.data;
}

export async function deletePage(key) {
  const response = await adminClient.delete(`/admin/pages/${key}`);
  return response.data?.data;
}

// Contact Messages
export async function fetchContactMessages() {
  const response = await adminClient.get('/admin/contact-messages');
  return response.data?.data || [];
}

export async function fetchContactMessage(id) {
  const response = await adminClient.get(`/admin/contact-messages/${id}`);
  return response.data?.data;
}

export async function updateContactMessage(id, data) {
  const response = await adminClient.put(`/admin/contact-messages/${id}`, data);
  return response.data?.data;
}

// Upload
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await adminClient.post('/admin/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data?.data;
}




