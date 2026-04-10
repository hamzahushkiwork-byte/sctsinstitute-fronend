import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MoreVert, Visibility } from '@mui/icons-material';
import * as courseRegistrationAPI from '../../../api/courseRegistration.api.js';
import PageTransition from '../../components/PageTransition.jsx';

export default function CourseRegistrationsList() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: 'pending', notes: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const data = await courseRegistrationAPI.getAllRegistrations();
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      showSnackbar('Failed to load course registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      await courseRegistrationAPI.updateRegistrationStatus(
        selectedId,
        statusForm.status,
        statusForm.notes
      );
      showSnackbar('Status updated successfully', 'success');
      setStatusDialogOpen(false);
      setAnchorEl(null);
      loadRegistrations();
    } catch (error) {
      showSnackbar(error.message || 'Failed to update status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuClick = (event, registration) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(registration._id || registration.id);
    setStatusForm({
      status: registration.status || 'pending',
      notes: registration.notes || '',
    });
  };

  const handleStatusClick = () => {
    setStatusDialogOpen(true);
    setAnchorEl(null);
  };

  const getUserName = (user) => {
    if (!user) return 'N/A';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email || 'N/A';
  };

  /** YYYY-MM-DD from CourseDetails calendar registration; friendly label for admin */
  const formatChosenSessionDate = (reg) => {
    const key = reg?.sessionDateKey;
    if (key == null || String(key).trim() === '') return '';
    const s = String(key).trim();
    const parts = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!parts) return s;
    const y = Number(parts[1]);
    const m = Number(parts[2]);
    const d = Number(parts[3]);
    try {
      return new Date(y, m - 1, d).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return s;
    }
  };

  const columns = [
    {
      field: 'course',
      headerName: 'Course',
      flex: 1,
      valueGetter: (params) => {
        try {
          if (!params?.row) return 'N/A';
          const course = params.row.courseId;
          
          // Check if course is a populated object with title
          if (course && typeof course === 'object' && !Array.isArray(course)) {
            if (course.title) {
              return course.title;
            }
            // Check if it's a Mongoose document with toObject
            if (course.toObject && typeof course.toObject === 'function') {
              const courseObj = course.toObject();
              return courseObj.title || 'N/A';
            }
          }
          
          return 'N/A';
        } catch (error) {
          console.error('Error getting course:', error);
          return 'N/A';
        }
      },
    },
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      valueGetter: (params) => {
        try {
          if (!params?.row) return 'N/A';
          const user = params.row.userId;
          
          // Check if user is a populated object
          if (user && typeof user === 'object' && !Array.isArray(user)) {
            // Check if it's a Mongoose document with toObject
            if (user.toObject && typeof user.toObject === 'function') {
              const userObj = user.toObject();
              return getUserName(userObj);
            }
            return getUserName(user);
          }
          
          return 'N/A';
        } catch (error) {
          console.error('Error getting user:', error);
          return 'N/A';
        }
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      valueGetter: (params) => {
        try {
          if (!params?.row) return 'N/A';
          const user = params.row.userId;
          
          if (user && typeof user === 'object' && !Array.isArray(user)) {
            // Check if it's a Mongoose document
            if (user.toObject && typeof user.toObject === 'function') {
              const userObj = user.toObject();
              return userObj.email || 'N/A';
            }
            return user.email || 'N/A';
          }
          
          return 'N/A';
        } catch (error) {
          console.error('Error getting email:', error);
          return 'N/A';
        }
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      valueGetter: (params) => {
        try {
          if (!params?.row) return 'N/A';
          const user = params.row.userId;
          
          if (user && typeof user === 'object' && !Array.isArray(user)) {
            // Check if it's a Mongoose document
            if (user.toObject && typeof user.toObject === 'function') {
              const userObj = user.toObject();
              return userObj.phoneNumber || 'N/A';
            }
            return user.phoneNumber || 'N/A';
          }
          
          return 'N/A';
        } catch (error) {
          console.error('Error getting phone:', error);
          return 'N/A';
        }
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'pending'}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'sessionDateKey',
      headerName: 'Session date',
      width: 160,
      sortable: false,
      valueGetter: (params) => {
        const label = formatChosenSessionDate(params?.row);
        return label || '—';
      },
    },
    {
      field: 'registeredAt',
      headerName: 'Registered',
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : '',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => setSelectedRegistration(params.row)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, params.row)}
          >
            <MoreVert />
          </IconButton>
        </Box>
      ),
    },
  ];

  const detailSessionLabel = formatChosenSessionDate(selectedRegistration);

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Course Registrations
        </Typography>

        <DataGrid
          rows={registrations}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{ height: 600 }}
        />

        {/* Registration Details Dialog */}
        <Dialog
          open={!!selectedRegistration}
          onClose={() => setSelectedRegistration(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Registration Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              <strong>Course:</strong> {selectedRegistration?.courseId?.title || 'N/A'}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>User:</strong> {getUserName(selectedRegistration?.userId)}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Email:</strong> {selectedRegistration?.userId?.email || 'N/A'}
            </Typography>
            {selectedRegistration?.userId?.phoneNumber && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Phone:</strong> {selectedRegistration.userId.phoneNumber}
              </Typography>
            )}
            <Typography variant="subtitle2" gutterBottom>
              <strong>Status:</strong>{' '}
              <Chip
                label={selectedRegistration?.status || 'pending'}
                color={getStatusColor(selectedRegistration?.status)}
                size="small"
              />
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Chosen session (calendar):</strong>{' '}
              {detailSessionLabel ||
                'Not specified — user may have used “Register” without picking a day, or legacy registration.'}
            </Typography>
            {detailSessionLabel && selectedRegistration?.sessionDateKey ? (
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mb: 1, mt: -0.5 }}
              >
                {String(selectedRegistration.sessionDateKey).trim()}
              </Typography>
            ) : null}
            <Typography variant="subtitle2" gutterBottom>
              <strong>Registered:</strong>{' '}
              {selectedRegistration?.registeredAt
                ? new Date(selectedRegistration.registeredAt).toLocaleString()
                : 'N/A'}
            </Typography>
            {selectedRegistration?.notes && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Notes:</strong> {selectedRegistration.notes}
              </Typography>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Registration Status</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </TextField>
              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={4}
                value={statusForm.notes}
                onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                placeholder="Add any notes about this registration..."
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusChange} variant="contained" color="primary">
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Menu */}
        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={handleStatusClick}>Update Status</MenuItem>
        </Menu>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}
