// FIX: blank screen caused by AdminLayout using theme tokens without ThemeProvider context (2024-12-19)
import { Box, Drawer, Container, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';
import '../styles/admin.css';

const drawerWidth = 280;

export default function AdminLayout() {
  return (
    <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f6f7fb', flex: 1 }}>
        <Topbar />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              top: '64px',
              borderRight: '1px solid #e2e8f0',
              bgcolor: '#ffffff',
            },
          }}
        >
          <Sidebar />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: '64px',
            minHeight: 'calc(100vh - 64px)',
            bgcolor: '#f6f7fb',
          }}
        >
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, minHeight: 'calc(100vh - 120px)' }}>
              <Outlet />
            </Paper>
          </Container>
        </Box>
      </Box>
    </div>
  );
}

