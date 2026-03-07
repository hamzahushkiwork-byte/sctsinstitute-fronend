# Admin Dashboard Documentation

## Overview

Complete admin dashboard for managing SCT Institute website content. Built with React, MUI, and connected to MongoDB backend.

## Access

- **URL**: `http://localhost:5173/admin`
- **Login**: Use admin credentials from backend seed data
  - Email: `admin@sctsinstitute.com`
  - Password: `Admin@12345`

## Features

### Authentication
- Login page at `/admin/login`
- JWT token-based authentication
- Automatic token refresh on 401 errors
- Tokens stored in localStorage
- Protected routes with route guards

### Dashboard Sections

1. **Hero Slides** (`/admin/hero-slides`)
   - Manage home page slider slides
   - Support for image and video backgrounds
   - Order management
   - Active/inactive toggle

2. **Services** (`/admin/services`)
   - Full CRUD for services
   - Section management with featured courses
   - Image uploads (card + hero)
   - Slug auto-generation

3. **Courses & Programs** (`/admin/courses`)
   - Manage training courses
   - Category, level, duration, price
   - Tags support
   - Image uploads

4. **Partners** (`/admin/partners`)
   - Manage partner/accreditation logos
   - Website links
   - Order management

5. **Pages Content** (`/admin/pages`)
   - Edit page content blocks (About, Contact, etc.)
   - JSON editor for flexible content structure
   - Key-based content management

6. **Contact Messages** (`/admin/contacts`)
   - View all contact form submissions
   - Status management (new/read/archived)
   - Read-only with status updates

## File Structure

```
src/admin/
├── AdminApp.jsx              # Main admin app with MUI theme
├── routes/
│   └── adminRoutes.jsx       # Admin route definitions
├── layout/
│   └── AdminLayout.jsx       # Sidebar + Topbar layout
├── components/
│   ├── Sidebar.jsx           # Navigation sidebar
│   ├── Topbar.jsx            # Top bar with logout
│   ├── ConfirmDialog.jsx    # Delete confirmation
│   ├── UploadField.jsx       # File upload component
│   └── PageTransition.jsx   # Framer Motion transitions
├── pages/
│   ├── Login.jsx             # Login page
│   ├── DashboardHome.jsx     # Dashboard overview
│   ├── HeroSlides/
│   │   └── HeroSlidesList.jsx
│   ├── Services/
│   │   └── ServicesList.jsx
│   ├── Courses/
│   │   └── CoursesList.jsx
│   ├── Partners/
│   │   └── PartnersList.jsx
│   ├── Pages/
│   │   └── PagesList.jsx
│   └── Contacts/
│       └── ContactsList.jsx
├── utils/
│   ├── authStorage.js        # Token storage helpers
│   ├── routeGuard.jsx        # Protected route wrapper
│   └── formDefaults.js      # Default form values
└── styles/
    └── admin.css             # Admin-specific styles
```

## API Integration

All admin operations use authenticated API calls:
- Base URL: `http://localhost:5000/api/v1`
- Auth header: `Authorization: Bearer <accessToken>`
- Automatic token refresh on 401
- File uploads via `/admin/uploads`

## Usage

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd my-react-vite-app && npm run dev`
3. **Access Admin**: Navigate to `http://localhost:5173/admin/login`
4. **Login**: Use admin credentials
5. **Manage Content**: Use sidebar navigation to access different sections

## Security

- All admin routes require authentication
- Tokens automatically refreshed
- Logout clears all tokens
- Public website remains unchanged



