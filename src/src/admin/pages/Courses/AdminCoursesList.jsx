import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  LinearProgress,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as coursesAPI from '../../../api/admin/courses.admin.api.js';
import PageTransition from '../../components/PageTransition.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SmartTable from '../../components/SmartTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import useToast from '../../hooks/useToast.jsx';
import { toAbsoluteMediaUrl } from '../../../utils/mediaUrl.js';

export default function AdminCoursesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error, ToastComponent } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    cardBody: '',
    description: '',
    sortOrder: 0,
    isActive: true,
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCourses();
    if (id && id !== 'new') {
      loadCourse(id);
    } else if (id === 'new') {
      resetForm();
      setOpenDialog(true);
    }
  }, [id]);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      cardBody: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      isAvailable: true,
    });
    setImageFile(null);
    setImagePreview('');
    setActiveTab(0);
  };

  const loadCourses = async () => {
    try {
      const data = await coursesAPI.listAdminCourses();
      setCourses(data || []);
    } catch (err) {
      error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadCourse = async (courseId) => {
    try {
      const course = await coursesAPI.getAdminCourseById(courseId);
      setFormData({
        title: course.title || '',
        slug: course.slug || '',
        cardBody: course.cardBody || '',
        description: course.description || '',
        sortOrder: course.sortOrder || 0,
        isActive: course.isActive !== undefined ? course.isActive : true,
        isAvailable: course.isAvailable !== undefined ? course.isAvailable : true,
      });
      setImagePreview(course.imageUrl ? toAbsoluteMediaUrl(course.imageUrl) : '');
      setImageFile(null);
      setOpenDialog(true);
    } catch (err) {
      error('Failed to load course');
      navigate('/admin/courses');
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      error('Title is required');
      return;
    }

    try {
      setUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', String(formData.title || '').trim());

      if (formData.slug && String(formData.slug).trim()) {
        formDataToSend.append('slug', String(formData.slug).trim());
      }

      formDataToSend.append('cardBody', String(formData.cardBody || ''));
      formDataToSend.append('description', String(formData.description || ''));
      formDataToSend.append('sortOrder', String(formData.sortOrder ?? 0));
      formDataToSend.append('isActive', String(formData.isActive !== false));
      formDataToSend.append('isAvailable', String(formData.isAvailable !== false));

      if (imageFile && imageFile instanceof File) {
        formDataToSend.append('image', imageFile);
      }

      if (id && id !== 'new') {
        await coursesAPI.updateAdminCourse(id, formDataToSend);
        success('Course updated successfully');
      } else {
        await coursesAPI.createAdminCourse(formDataToSend);
        success('Course created successfully');
      }

      setOpenDialog(false);
      resetForm();
      navigate('/admin/courses');
      loadCourses();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save course';
      error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await coursesAPI.deleteAdminCourse(deleteId);
      success('Course deleted successfully');
      setDeleteId(null);
      loadCourses();
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to delete course');
    }
  };

  const handleToggleActive = async (row, newStatus) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', row.title);
      formDataToSend.append('isActive', String(newStatus));
      // Keep other fields
      formDataToSend.append('isAvailable', String(row.isAvailable !== false));

      await coursesAPI.updateAdminCourse(row._id || row.id, formDataToSend);
      success('Course status updated successfully');
      loadCourses();
    } catch (err) {
      error('Failed to update course status');
    }
  };

  const handleToggleAvailable = async (row) => {
    try {
      await coursesAPI.toggleCourseAvailability(row._id || row.id);
      success('Course availability updated successfully');
      loadCourses();
    } catch (err) {
      error('Failed to update course availability');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        error('File size must be less than 10MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
    },
    {
      field: 'slug',
      headerName: 'Slug',
      width: 200,
    },
    { field: 'sortOrder', headerName: 'Order', width: 100 },
    {
      field: 'isAvailable',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={params.row.isAvailable !== false}
              onChange={() => handleToggleAvailable(params.row)}
              color="success"
            />
          }
          label={params.row.isAvailable !== false ? "Available Now" : "Coming Soon"}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: '0.75rem',
              fontWeight: 600,
              color: params.row.isAvailable !== false ? 'success.main' : 'warning.main'
            }
          }}
        />
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 150,
      valueGetter: (params) => {
        if (!params.row || !params.row.updatedAt) return '';
        return new Date(params.row.updatedAt).toLocaleDateString();
      },
    },
  ];

  return (
    <PageTransition>
      <Box>
        <PageHeader
          title="Courses"
          subtitle="Manage course catalog and content"
          primaryAction={() => navigate('/admin/courses/new')}
          primaryActionLabel="Create New"
        />

        <SmartTable
          rows={courses}
          columns={columns}
          loading={loading}
          searchFields={['title', 'slug', 'cardBody']}
          onEdit={(row) => navigate(`/admin/courses/${row._id || row.id}`)}
          onDelete={(row) => setDeleteId(row._id || row.id)}
          onToggleActive={handleToggleActive}
          activeField="isActive"
          imageField="imageUrl"
          emptyMessage="No courses found. Create your first course to get started."
        />

        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            resetForm();
            navigate('/admin/courses');
          }}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              {id === 'new' ? 'Create Course' : 'Edit Course'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {uploading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            >
              <Tab label="Basic Information" />
              <Tab label="Media" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  margin="normal"
                  required
                  helperText="Course title (required)"
                  error={!formData.title && formData.title !== ''}
                />

                <TextField
                  fullWidth
                  label="Slug"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  margin="normal"
                  helperText="URL-friendly slug (auto-generated from title if empty)"
                />

                <TextField
                  fullWidth
                  label="Card Body"
                  value={formData.cardBody || ''}
                  onChange={(e) => setFormData({ ...formData, cardBody: e.target.value })}
                  margin="normal"
                  multiline
                  rows={3}
                  helperText="Brief text shown on course card (optional)"
                />

                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={6}
                  helperText="Full description for details page (optional)"
                />

                <TextField
                  fullWidth
                  label="Sort Order"
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  margin="normal"
                  helperText="Lower numbers appear first"
                />

                <Box sx={{ display: 'flex', gap: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive !== false}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="Visible on Site"
                    sx={{ mt: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isAvailable !== false}
                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                        color="success"
                      />
                    }
                    label={formData.isAvailable !== false ? "Status: Available Now" : "Status: Coming Soon"}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button variant="outlined" component="span" disabled={uploading} fullWidth>
                      {imageFile ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </label>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Supported formats: PNG, JPG, JPEG, WEBP (Max 10MB)
                  </Typography>
                </Box>

                {(imagePreview || formData.imageUrl) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Image Preview:
                    </Typography>
                    <Box
                      component="img"
                      src={imagePreview || toAbsoluteMediaUrl(formData.imageUrl || '')}
                      alt="Image preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1,
                        bgcolor: 'background.default',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => {
                setOpenDialog(false);
                resetForm();
                navigate('/admin/courses');
              }}
              disabled={uploading}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={uploading || !formData.title?.trim()}
              sx={{ minWidth: 120 }}
            >
              {uploading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

        <ToastComponent />
      </Box>
    </PageTransition>
  );
}
