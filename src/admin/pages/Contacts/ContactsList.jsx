import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import apiClient from '../../../api/client.js';
import PageTransition from '../../components/PageTransition.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SmartTable from '../../components/SmartTable.jsx';

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
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

  const handleStatusChange = async (row, newIsActive) => {
    // Note: status in contact messages is 'new', 'read', 'archived'
    // NewisActive here refers to the toggle, but we use it for 'read'/'new' status
    const id = row._id || row.id;
    const newStatus = newIsActive ? 'read' : 'new';
    try {
      await apiClient.put(`/admin/contact-messages/${id}`, { status: newStatus });
      showSnackbar(`Message marked as ${newStatus}`, 'success');
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
  ];

  return (
    <PageTransition>
      <Box>
        <PageHeader
          title="Contact Messages"
          subtitle="Manage and respond to student inquiries"
        />

        <SmartTable
          rows={contacts}
          columns={columns}
          loading={loading}
          searchFields={['name', 'email', 'subject', 'message']}
          onEdit={(row) => setSelectedContact(row)}
          activeField="status"
          onToggleActive={(row) => {
            const nextStatus = row.status === 'new' ? 'read' : 'new';
            handleStatusChange(row, nextStatus === 'read');
          }}
          getRowId={(row) => row._id || row.id}
          emptyMessage="No messages found."
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PageTransition>
  );
}



