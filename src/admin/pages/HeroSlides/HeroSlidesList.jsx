import { useState, useEffect, useMemo } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import apiClient from '../../../api/client.js';
import PageTransition from '../../components/PageTransition.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import UploadField from '../../components/UploadField.jsx';
import { heroSlideDefaults } from '../../utils/formDefaults.js';

export default function HeroSlidesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [formData, setFormData] = useState(heroSlideDefaults);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadSlides();
    if (id && id !== 'new') {
      loadSlide(id);
    } else if (id === 'new') {
      setFormData(heroSlideDefaults);
      setOpenDialog(true);
    }
  }, [id]);

  const loadSlides = async () => {
    try {
      const response = await apiClient.get('/admin/hero-slides');
      setSlides(response.data?.data || []);
    } catch (error) {
      showSnackbar('Failed to load hero slides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSlide = async (slideId) => {
    try {
      const response = await apiClient.get(`/admin/hero-slides/${slideId}`);
      setFormData(response.data?.data || heroSlideDefaults);
      setOpenDialog(true);
    } catch (error) {
      showSnackbar('Failed to load slide', 'error');
      navigate('/admin/hero-slides');
    }
  };

  const handleSave = async () => {
    try {
      if (id && id !== 'new') {
        await apiClient.put(`/admin/hero-slides/${id}`, formData);
        showSnackbar('Slide updated successfully', 'success');
      } else {
        await apiClient.post('/admin/hero-slides', formData);
        showSnackbar('Slide created successfully', 'success');
      }
      setOpenDialog(false);
      navigate('/admin/hero-slides');
      loadSlides();
    } catch (error) {
      showSnackbar(error.message || 'Failed to save slide', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/hero-slides/${deleteId}`);
      showSnackbar('Slide deleted successfully', 'success');
      setDeleteId(null);
      loadSlides();
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete slide', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Filter slides based on search text
  const filteredSlides = useMemo(() => {
    if (!searchText) return slides;
    const searchLower = searchText.toLowerCase();
    return slides.filter(
      (slide) =>
        slide.title?.toLowerCase().includes(searchLower) ||
        slide.subtitle?.toLowerCase().includes(searchLower) ||
        slide.type?.toLowerCase().includes(searchLower)
    );
  }, [slides, searchText]);

  const columns = [
    { field: 'order', headerName: 'Order', width: 100, type: 'number' },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 180,
      type: 'dateTime',
      valueGetter: (params) => (params.value ? new Date(params.value) : null),
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
            onClick={() => navigate(`/admin/hero-slides/${params.row._id || params.row.id}`)}
          >
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => setDeleteId(params.row._id || params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PageTransition>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <h2 style={{ margin: 0, marginBottom: 8 }}>Hero Slides</h2>
            <TextField
              size="small"
              placeholder="Search slides..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/hero-slides/new')}
            sx={{ borderRadius: 2 }}
          >
            Create New
          </Button>
        </Box>

        {filteredSlides.length === 0 && !loading ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <p>No slides found{searchText ? ' matching your search' : ''}.</p>
            {!searchText && (
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => navigate('/admin/hero-slides/new')}
                sx={{ mt: 2 }}
              >
                Create Your First Slide
              </Button>
            )}
          </Box>
        ) : (
          <DataGrid
            rows={filteredSlides}
            columns={columns}
            loading={loading}
            getRowId={(row) => row._id || row.id}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'order', sort: 'asc' }] },
            }}
            sx={{ height: 600, border: 'none' }}
          />
        )}

        <Dialog open={openDialog} onClose={() => navigate('/admin/hero-slides')} maxWidth="md" fullWidth>
          <DialogTitle>{id === 'new' ? 'Create Hero Slide' : 'Edit Hero Slide'}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
            <UploadField
              label="Media URL"
              value={formData.mediaUrl || ''}
              onChange={(url) => setFormData({ ...formData, mediaUrl: url })}
              accept={formData.type === 'video' ? 'video/*' : 'image/*'}
            />
            <TextField
              fullWidth
              label="Button Text"
              value={formData.buttonText || ''}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Button Link"
              value={formData.buttonLink || ''}
              onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Order"
              type="number"
              value={formData.order || 0}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              margin="normal"
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
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button onClick={() => navigate('/admin/hero-slides')}>Cancel</Button>
            </Box>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Hero Slide"
          message="Are you sure you want to delete this slide?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

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

