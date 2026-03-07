import { Button, AppBar, Toolbar, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Logout, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearTokens, getRefreshToken } from '../../utils/authStorage.js';
import apiClient from '../../api/client.js';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/hero-slides': 'Hero Slides',
  '/admin/services': 'Services',
  '/admin/courses': 'Courses & Programs',
  '/admin/partners': 'Partners',
  '/admin/pages': 'Pages Content',
  '/admin/contacts': 'Contact Messages',
};

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    // Check for exact match first
    if (pageTitles[path]) {
      return pageTitles[path];
    }
    // Check for paths with IDs
    for (const [key, title] of Object.entries(pageTitles)) {
      if (path.startsWith(key) && path !== key) {
        return title;
      }
    }
    return 'Admin Dashboard';
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [{ label: 'Dashboard', path: '/admin' }];

    if (path === '/admin') {
      return crumbs;
    }

    for (const [key, title] of Object.entries(pageTitles)) {
      if (path.startsWith(key) && path !== '/admin') {
        crumbs.push({ label: title, path: key });
        // Check if it's a detail/edit page
        if (path !== key) {
          const parts = path.split('/');
          const lastPart = parts[parts.length - 1];
          if (lastPart === 'new') {
            crumbs.push({ label: 'New', path });
          } else if (lastPart !== key.split('/').pop()) {
            crumbs.push({ label: 'Edit', path });
          }
        }
        break;
      }
    }

    return crumbs;
  };

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      navigate('/admin/login');
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: 1300,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
            {getPageTitle()}
          </Typography>
          <Breadcrumbs separator="›" sx={{ fontSize: '0.875rem' }}>
            {getBreadcrumbs().map((crumb, index) => {
              const isLast = index === getBreadcrumbs().length - 1;
              return isLast ? (
                <Typography key={crumb.path} sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.path}
                  component="button"
                  variant="body2"
                  onClick={() => navigate(crumb.path)}
                  sx={{
                    color: '#64748b',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#14b8a6',
                      textDecoration: 'underline',
                    },
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    fontSize: '0.875rem',
                  }}
                >
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            borderColor: '#e2e8f0',
            color: '#1e293b',
            '&:hover': {
              borderColor: '#14b8a6',
              bgcolor: '#f1f5f9',
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
