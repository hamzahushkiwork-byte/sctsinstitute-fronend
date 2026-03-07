import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
  Dashboard,
  Slideshow,
  BusinessCenter,
  School,
  Handshake,
  CardMembership,
  Article,
  Mail,
  People,
  Assignment,
  Logout,
} from '@mui/icons-material';
import { Outlet } from 'react-router-dom';
import { clearTokens } from './authStorage.js';
import adminTheme from './theme/adminTheme.js';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Hero Slides', icon: <Slideshow />, path: '/admin/hero-slides' },
  { text: 'Services', icon: <BusinessCenter />, path: '/admin/services' },
  { text: 'Courses', icon: <School />, path: '/admin/courses' },
  { text: 'Partners', icon: <Handshake />, path: '/admin/partners' },
  { text: 'Certification', icon: <CardMembership />, path: '/admin/certification' },
  { text: 'Pages', icon: <Article />, path: '/admin/pages' },
  { text: 'Contacts', icon: <Mail />, path: '/admin/contacts' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Course Registrations', icon: <Assignment />, path: '/admin/course-registrations' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearTokens();
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const item = menuItems.find((item) => path === item.path || path.startsWith(item.path + '/'));
    return item ? item.text : 'Admin Dashboard';
  };

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: 'primary.main',
            boxShadow: 2,
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {getPageTitle()}
            </Typography>
            <Button color="inherit" startIcon={<Logout />} onClick={handleLogout} sx={{ fontWeight: 500 }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              top: '64px',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => navigate(item.path)}
                    sx={{
                      mx: 1,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.main',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.contrastText',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? 'inherit' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            mt: '64px',
            minHeight: 'calc(100vh - 64px)',
            width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
            maxWidth: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
            overflow: 'hidden',
          }}
        >
          <Container
            maxWidth="xl"
            sx={{
              py: 3,
              width: '100%',
              maxWidth: '100%',
              px: { xs: 2, sm: 3 },
            }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
                border: '1px solid',
                borderColor: 'divider',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              <Outlet />
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
