import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility, MoreVert } from '@mui/icons-material';
import apiClient from '../../../api/client.js';
import PageTransition from '../../components/PageTransition.jsx';

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await apiClient.get('/admin/contact-messages');
      setContacts(response.data?.data || []);
    } catch (error) {
      showSnackbar('Failed to load contact messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiClient.put(`/admin/contact-messages/${id}`, { status: newStatus });
      showSnackbar('Status updated successfully', 'success');
      setAnchorEl(null);
      loadContacts();
    } catch (error) {
      showSnackbar(error.message || 'Failed to update status', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'primary';
      case 'read':
        return 'success';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'new'}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
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
            onClick={() => setSelectedContact(params.row)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              setSelectedId(params.row._id || params.row.id);
            }}
          >
            <MoreVert />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageTransition>
      <Box>
        <h2>Contact Messages</h2>

        <DataGrid
          rows={contacts}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50]}
          sx={{ height: 600 }}
        />

        <Dialog
          open={!!selectedContact}
          onClose={() => setSelectedContact(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Contact Message Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Name:</strong> {selectedContact?.name}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Email:</strong> {selectedContact?.email}
            </Typography>
            {selectedContact?.phone && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Phone:</strong> {selectedContact.phone}
              </Typography>
            )}
            {selectedContact?.subject && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Subject:</strong> {selectedContact.subject}
              </Typography>
            )}
            <Typography variant="subtitle2" gutterBottom>
              <strong>Status:</strong>{' '}
              <Chip
                label={selectedContact?.status || 'new'}
                color={getStatusColor(selectedContact?.status)}
                size="small"
              />
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Date:</strong>{' '}
              {selectedContact?.createdAt
                ? new Date(selectedContact.createdAt).toLocaleString()
                : ''}
            </Typography>
            <DialogContentText sx={{ mt: 2 }}>
              <strong>Message:</strong>
            </DialogContentText>
            <DialogContentText sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
              {selectedContact?.message}
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleStatusChange(selectedId, 'read')}>
            Mark as Read
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange(selectedId, 'archived')}>
            Archive
          </MenuItem>
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



