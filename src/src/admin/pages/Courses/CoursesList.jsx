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
  Chip,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import apiClient from '../../../api/client.js';
import PageTransition from '../../components/PageTransition.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import UploadField from '../../components/UploadField.jsx';
import { courseDefaults } from '../../utils/formDefaults.js';

export default function CoursesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [formData, setFormData] = useState(courseDefaults);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadCourses();
    if (id && id !== 'new') {
      loadCourse(id);
    } else if (id === 'new') {
      setFormData(courseDefaults);
      setOpenDialog(true);
    }
  }, [id]);

  const loadCourses = async () => {
    try {
      const response = await apiClient.get('/admin/courses');
      setCourses(response.data?.data || []);
    } catch (error) {
      showSnackbar('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async (courseId) => {
    try {
      const response = await apiClient.get(`/admin/courses/${courseId}`);
      setFormData(response.data?.data || courseDefaults);
      setOpenDialog(true);
    } catch (error) {
      showSnackbar('Failed to load course', 'error');
      navigate('/admin/courses');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    const tags = [...(formData.tags || [])];
    tags.splice(index, 1);
    setFormData({ ...formData, tags });
  };

  const handleSave = async () => {
    try {
      if (id && id !== 'new') {
        await apiClient.put(`/admin/courses/${id}`, formData);
        showSnackbar('Course updated successfully', 'success');
      } else {
        await apiClient.post('/admin/courses', formData);
        showSnackbar('Course created successfully', 'success');
      }
      setOpenDialog(false);
      navigate('/admin/courses');
      loadCourses();
    } catch (error) {
      showSnackbar(error.message || 'Failed to save course', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/admin/courses/${deleteId}`);
      showSnackbar('Course deleted successfully', 'success');
      setDeleteId(null);
      loadCourses();
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete course', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'level', headerName: 'Level', width: 120 },
    {
      field: 'isActive',
      headerName: 'Active',
      width: 100,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
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
            onClick={() => navigate(`/admin/courses/${params.row._id || params.row.id}`)}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <h2>Courses & Programs</h2>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/courses/new')}
          >
            Create New
          </Button>
        </Box>

        <DataGrid
          rows={courses}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50]}
          sx={{ height: 600 }}
        />

        <Dialog open={openDialog} onClose={() => navigate('/admin/courses')} maxWidth="md" fullWidth>
          <DialogTitle>{id === 'new' ? 'Create Course' : 'Edit Course'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Category"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <UploadField
              label="Image"
              value={formData.image || ''}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
            <TextField
              fullWidth
              label="Level"
              value={formData.level || ''}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Duration"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price || ''}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })
              }
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                margin="normal"
                size="small"
                helperText="Press Enter to add tag"
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                {(formData.tags || []).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(index)}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
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
              <Button onClick={() => navigate('/admin/courses')}>Cancel</Button>
            </Box>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Course"
          message="Are you sure you want to delete this course?"
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



