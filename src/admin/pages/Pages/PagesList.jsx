import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Add } from '@mui/icons-material';
import apiClient from '../../../api/client.js';
import PageTransition from '../../components/PageTransition.jsx';
import { pageContentDefaults } from '../../utils/formDefaults.js';

export default function PagesList() {
  const { key } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!key);
  const [formData, setFormData] = useState({ ...pageContentDefaults, contentJsonString: '{}' });
  const [jsonError, setJsonError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadPages();
    if (key && key !== 'new') {
      loadPage(key);
    } else if (key === 'new') {
      setFormData({ ...pageContentDefaults, contentJsonString: '{}' });
      setJsonError('');
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, [key]);

  const loadPages = async () => {
    try {
      const response = await apiClient.get('/admin/pages');
      setPages(response.data?.data || []);
    } catch (error) {
      showSnackbar('Failed to load pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (pageKey) => {
    try {
      const response = await apiClient.get(`/admin/pages/${pageKey}`);
      const data = response.data?.data || pageContentDefaults;
      setFormData({
        ...data,
        contentJsonString: JSON.stringify(data.contentJson || {}, null, 2),
      });
      setJsonError('');
      setOpenDialog(true);
    } catch (error) {
      showSnackbar('Failed to load page', 'error');
      navigate('/admin/pages');
    }
  };

  const handleJsonChange = (value) => {
    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, contentJson: parsed, contentJsonString: value });
      setJsonError('');
    } catch (e) {
      setFormData({ ...formData, contentJsonString: value });
      setJsonError('Invalid JSON');
    }
  };

  const handleSave = async () => {
    if (jsonError) {
      showSnackbar('Please fix JSON errors before saving', 'error');
      return;
    }

    try {
      const payload = {
        ...formData,
        contentJson: formData.contentJson || {},
      };
      delete payload.contentJsonString;

      if (key && key !== 'new') {
        await apiClient.put(`/admin/pages/${key}`, payload);
        showSnackbar('Page updated successfully', 'success');
      } else {
        await apiClient.post('/admin/pages', payload);
        showSnackbar('Page created successfully', 'success');
      }
      setOpenDialog(false);
      navigate('/admin/pages');
      loadPages();
    } catch (error) {
      showSnackbar(error.message || 'Failed to save page', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const columns = [
    { field: 'key', headerName: 'Key', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={() => navigate(`/admin/pages/${params.row.key}`)}
        >
          <Edit />
        </IconButton>
      ),
    },
  ];

  return (
    <PageTransition>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <h2>Pages Content</h2>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/pages/new')}
          >
            Create New
          </Button>
        </Box>

        <DataGrid
          rows={pages}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.key || row._id}
          pageSizeOptions={[10, 25, 50]}
          sx={{ height: 600 }}
        />

        <Dialog open={openDialog} onClose={() => navigate('/admin/pages')} maxWidth="lg" fullWidth>
          <DialogTitle>{key && key !== 'new' ? `Edit Page: ${key}` : 'Create Page Content'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              margin="normal"
              disabled={!!key && key !== 'new'}
              helperText="URL-friendly identifier (e.g., about, contact)"
            />
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Content JSON"
              value={formData.contentJsonString || ''}
              onChange={(e) => handleJsonChange(e.target.value)}
              margin="normal"
              multiline
              rows={12}
              error={!!jsonError}
              helperText={jsonError || 'Enter valid JSON content'}
              sx={{ fontFamily: 'monospace' }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="contained" onClick={handleSave} disabled={!!jsonError}>
                Save
              </Button>
              <Button onClick={() => navigate('/admin/pages')}>Cancel</Button>
            </Box>
          </DialogContent>
        </Dialog>

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

