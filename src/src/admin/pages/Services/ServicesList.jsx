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
  IconButton,
  LinearProgress,
  Tabs,
  Tab,
  Typography,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import * as servicesAPI from '../../../services/services.api.js';
import PageTransition from '../../components/PageTransition.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SmartTable from '../../components/SmartTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import useToast from '../../hooks/useToast.jsx';
import { toAbsoluteMediaUrl } from '../../../utils/mediaUrl.js';

export default function ServicesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error, ToastComponent } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [innerImageFile, setInnerImageFile] = useState(null);
  const [innerImagePreview, setInnerImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadServices();
    if (id && id !== 'new') {
      loadService(id);
    } else if (id === 'new') {
      resetForm();
      setOpenDialog(true);
    }
  }, [id]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      sortOrder: 0,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setInnerImageFile(null);
    setInnerImagePreview('');
    setActiveTab(0);
  };

  const loadServices = async () => {
    try {
      const data = await servicesAPI.getServices();
      setServices(data || []);
    } catch (err) {
      error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const loadService = async (serviceId) => {
    try {
      const service = await servicesAPI.getServiceById(serviceId);
      setFormData({
        title: service.title || '',
        description: service.description || '',
        sortOrder: service.sortOrder || 0,
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
      setImagePreview(service.imageUrl ? toAbsoluteMediaUrl(service.imageUrl) : '');
      setImageFile(null);
      setInnerImagePreview(service.innerImageUrl ? toAbsoluteMediaUrl(service.innerImageUrl) : '');
      setInnerImageFile(null);
      setOpenDialog(true);
    } catch (err) {
      error('Failed to load service');
      navigate('/admin/services');
    }
  };

  const handleSave = async () => {
    // Client-side validation
    if (!formData.title || !formData.title.trim()) {
      error('Title is required');
      return;
    }

    if (!formData.description || !formData.description.trim()) {
      error('Description is required');
      return;
    }

    // For new services, both image files are REQUIRED
    if (id === 'new' && !imageFile) {
      error('Card image is required for new services');
      return;
    }

    if (id === 'new' && !innerImageFile) {
      error('Inner image (details page) is required for new services');
      return;
    }

    // Validate imageFile is a real File object
    if (id === 'new' && (!(imageFile instanceof File) || !imageFile.name)) {
      error('Please select a valid card image file');
      return;
    }

    if (id === 'new' && (!(innerImageFile instanceof File) || !innerImageFile.name)) {
      error('Please select a valid inner image file');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add required fields with EXACT keys matching schema
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      
      // Add sortOrder (number as string)
      formDataToSend.append('sortOrder', String(formData.sortOrder || 0));
      
      // Add isActive (boolean as string)
      formDataToSend.append('isActive', String(formData.isActive !== false));
      
      // Add image files - REQUIRED for new services, optional for updates
      if (imageFile && imageFile instanceof File) {
        formDataToSend.append('image', imageFile);
      }
      
      if (innerImageFile && innerImageFile instanceof File) {
        formDataToSend.append('innerImage', innerImageFile);
      }

      if (id && id !== 'new') {
        // Update existing service
        await servicesAPI.updateService(id, formDataToSend);
        success('Service updated successfully');
      } else {
        // Create new service
        await servicesAPI.createService(formDataToSend);
        success('Service created successfully');
      }
      
      // Reset form and close dialog
      setOpenDialog(false);
      resetForm();
      navigate('/admin/services');
      loadServices();
    } catch (err) {
      console.error('[handleSave] Error:', err);
      
      // Extract detailed error message
      let errorMessage = 'Failed to save service';
      if (err.response?.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await servicesAPI.deleteService(deleteId);
      showSnackbar('Service deleted successfully', 'success');
      setDeleteId(null);
      loadServices();
    } catch (error) {
      showSnackbar(error.response?.data?.message || error.message || 'Failed to delete service', 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        error('Please select an image file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        error('File size must be less than 10MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInnerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        error('Please select an image file');
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        error('File size must be less than 10MB');
        return;
      }

      setInnerImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setInnerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleActive = async (row, newStatus) => {
    try {
      await servicesAPI.toggleServiceActive(row._id || row.id, newStatus);
      success('Service status updated successfully');
      loadServices();
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to update service status');
    }
  };

  const columns = [
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1,
    },
    { field: 'sortOrder', headerName: 'Order', width: 100 },
  ];

  return (
    <PageTransition>
      <Box>
        <PageHeader
          title="Services"
          subtitle="Manage service offerings and content"
          primaryAction={() => navigate('/admin/services/new')}
          primaryActionLabel="Create New"
        />

        <SmartTable
          rows={services}
          columns={columns}
          loading={loading}
          searchFields={['title', 'description']}
          onEdit={(row) => navigate(`/admin/services/${row._id || row.id}`)}
          onDelete={(row) => setDeleteId(row._id || row.id)}
          onToggleActive={handleToggleActive}
          activeField="isActive"
          imageField="imageUrl"
          emptyMessage="No services found. Create your first service to get started."
        />

        <Dialog open={openDialog} onClose={() => navigate('/admin/services')} maxWidth="md" fullWidth>
          <DialogTitle>{id === 'new' ? 'Create Service' : 'Edit Service'}</DialogTitle>
          <DialogContent>
            {uploading && <LinearProgress sx={{ mb: 2 }} />}
            
            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
              helperText="Service title (required)"
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              required
              multiline
              rows={4}
              helperText="Service description (required)"
            />
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" disabled={uploading} sx={{ mr: 1 }}>
                  {imageFile ? 'Change Card Image' : 'Upload Card Image'}
                </Button>
              </label>
              {id === 'new' && !imageFile && !imagePreview && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Card image is required for new services (png, jpg, jpeg, webp - max 10MB)
                </Alert>
              )}
            </Box>
            
            {(imagePreview || formData.imageUrl) && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Card Image Preview:</p>
                <img
                  src={imagePreview || toAbsoluteMediaUrl(formData.imageUrl || '')}
                  alt="Card image preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 2, mb: 1 }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleInnerImageChange}
                style={{ display: 'none' }}
                id="inner-image-upload"
              />
              <label htmlFor="inner-image-upload">
                <Button variant="outlined" component="span" disabled={uploading}>
                  {innerImageFile ? 'Change Inner Image' : 'Upload Inner Image (Details Page)'}
                </Button>
              </label>
              {id === 'new' && !innerImageFile && !innerImagePreview && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Inner image (details page) is required for new services (png, jpg, jpeg, webp - max 10MB)
                </Alert>
              )}
            </Box>
            
            {(innerImagePreview || formData.innerImageUrl) && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Inner Image Preview:</p>
                <img
                  src={innerImagePreview || toAbsoluteMediaUrl(formData.innerImageUrl || '')}
                  alt="Inner image preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                />
              </Box>
            )}
            
            <TextField
              fullWidth
              label="Sort Order"
              type="number"
              value={formData.sortOrder || 0}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              margin="normal"
              helperText="Lower numbers appear first"
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
              <Button variant="contained" onClick={handleSave} disabled={uploading}>
                {uploading ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={() => {
                setOpenDialog(false);
                setImageFile(null);
                setImagePreview('');
                setInnerImageFile(null);
                setInnerImagePreview('');
                navigate('/admin/services');
              }} disabled={uploading}>
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Service"
          message="Are you sure you want to delete this service?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

        <ToastComponent />
      </Box>
    </PageTransition>
  );
}
