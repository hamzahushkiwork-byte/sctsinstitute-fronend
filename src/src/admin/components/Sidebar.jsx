import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Slideshow,
  BusinessCenter,
  School,
  Handshake,
  Article,
  Mail,
  Home,
} from '@mui/icons-material';

const contentItems = [
  { text: 'Hero Slides', icon: Slideshow, path: '/admin/hero-slides' },
  { text: 'Services', icon: BusinessCenter, path: '/admin/services' },
  { text: 'Courses & Programs', icon: School, path: '/admin/courses' },
  { text: 'Partners', icon: Handshake, path: '/admin/partners' },
  { text: 'Pages Content', icon: Article, path: '/admin/pages' },
];

const communicationItems = [
  { text: 'Contact Messages', icon: Mail, path: '/admin/contacts' },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Admin Panel
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1, px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/admin"
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: isActive('/admin') ? '#14b8a6' : 'transparent',
              color: isActive('/admin') ? '#ffffff' : '#1e293b',
              '&:hover': {
                bgcolor: isActive('/admin') ? '#0d9488' : '#f1f5f9',
              },
              '&.active': {
                bgcolor: '#14b8a6',
                color: '#ffffff',
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive('/admin') ? '#ffffff' : '#64748b',
                minWidth: 40,
              }}
            >
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <Box sx={{ mt: 2, mb: 1, px: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Content
          </Typography>
        </Box>

        {contentItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? '#14b8a6' : 'transparent',
                  color: active ? '#ffffff' : '#1e293b',
                  borderLeft: active ? '3px solid' : '3px solid transparent',
                  borderColor: active ? '#0d9488' : 'transparent',
                  pl: active ? 1.5 : 2,
                  '&:hover': {
                    bgcolor: active ? '#0d9488' : '#f1f5f9',
                  },
                  '&.active': {
                    bgcolor: '#14b8a6',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? '#ffffff' : '#64748b',
                    minWidth: 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}

        <Box sx={{ mt: 2, mb: 1, px: 2 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Communication
          </Typography>
        </Box>

        {communicationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? '#14b8a6' : 'transparent',
                  color: active ? '#ffffff' : '#1e293b',
                  borderLeft: active ? '3px solid' : '3px solid transparent',
                  borderColor: active ? '#0d9488' : 'transparent',
                  pl: active ? 1.5 : 2,
                  '&:hover': {
                    bgcolor: active ? '#0d9488' : '#f1f5f9',
                  },
                  '&.active': {
                    bgcolor: '#14b8a6',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? '#ffffff' : '#64748b',
                    minWidth: 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/"
            target="_blank"
            sx={{
              borderRadius: 2,
              mt: 1,
              color: '#64748b',
              '&:hover': {
                bgcolor: '#f1f5f9',
                color: '#1e293b',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#64748b', minWidth: 40 }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Back to Website" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

