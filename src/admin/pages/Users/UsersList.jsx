import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import adminClient from '../../../api/adminClient.js';
import PageTransition from '../../components/PageTransition.jsx';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminClient.get('/admin/users');
      setUsers(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      valueGetter: (params) => {
        if (!params || !params.row) return 'N/A';
        if (params.row.firstName && params.row.lastName) {
          return `${params.row.firstName} ${params.row.lastName}`;
        }
        return params.row.name || 'N/A';
      }
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { 
      field: 'phoneNumber', 
      headerName: 'Phone', 
      flex: 1,
      valueGetter: (params) => {
        if (!params || !params.row) return 'N/A';
        return params.row.phoneNumber || 'N/A';
      }
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'user'}
          color={getRoleColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Registered',
      width: 180,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : '',
    },
  ];

  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Registered Users
        </Typography>

        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{ 
            height: 600,
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
          }}
          onRowClick={(params) => setSelectedUser(params.row)}
        />

        <Dialog
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
              <strong>Name:</strong> {selectedUser?.firstName && selectedUser?.lastName 
                ? `${selectedUser.firstName} ${selectedUser.lastName}`
                : selectedUser?.name || 'N/A'}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Email:</strong> {selectedUser?.email}
            </Typography>
            {selectedUser?.phoneNumber && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Phone:</strong> {selectedUser.phoneNumber}
              </Typography>
            )}
            <Typography variant="subtitle2" gutterBottom>
              <strong>Role:</strong>{' '}
              <Chip
                label={selectedUser?.role || 'user'}
                color={getRoleColor(selectedUser?.role)}
                size="small"
              />
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              <strong>Registered:</strong>{' '}
              {selectedUser?.createdAt
                ? new Date(selectedUser.createdAt).toLocaleString()
                : 'N/A'}
            </Typography>
            {selectedUser?.updatedAt && (
              <Typography variant="subtitle2" gutterBottom>
                <strong>Last Updated:</strong>{' '}
                {new Date(selectedUser.updatedAt).toLocaleString()}
              </Typography>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </PageTransition>
  );
}
