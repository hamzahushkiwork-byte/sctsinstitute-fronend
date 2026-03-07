// FIX: blank screen caused by AdminLayout/Sidebar/Topbar using theme tokens without ThemeProvider context (2024-12-19)
import { ThemeProvider } from '@mui/material/styles';
import AdminRoutes from './routes/adminRoutes.jsx';
import adminTheme from './theme/adminTheme.js';

export default function AdminApp() {
  return (
    <ThemeProvider theme={adminTheme}>
      <AdminRoutes />
    </ThemeProvider>
  );
}

