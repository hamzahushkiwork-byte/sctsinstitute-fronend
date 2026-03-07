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
import { Add } from '@mui/icons-material';
import * as certificationAPI from '../../../api/admin/certification.admin.api.js';
import PageTransition from '../../components/PageTransition.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import SmartTable from '../../components/SmartTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import useToast from '../../hooks/useToast.jsx';
import { toAbsoluteMediaUrl } from '../../../utils/mediaUrl.js';

export default function AdminCertificationList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error, ToastComponent } = useToast();
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    heroSubtitle: '',
    shortDescription: '',
    description: '',
    sortOrder: 0,
    isActive: true,
  });
  const [cardImageFile, setCardImageFile] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState('');
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [innerImageFile, setInnerImageFile] = useState(null);
  const [innerImagePreview, setInnerImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadCertifications();
    if (id && id !== 'new') {
      loadCertification(id);
    } else if (id === 'new') {
      resetForm();
      setOpenDialog(true);
    }
  }, [id]);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      heroSubtitle: '',
      shortDescription: '',
      description: '',
      sortOrder: 0,
      isActive: true,
    });
    setCardImageFile(null);
    setCardImagePreview('');
    setHeroImageFile(null);
    setHeroImagePreview('');
    setInnerImageFile(null);
    setInnerImagePreview('');
    setActiveTab(0);
  };

  const loadCertifications = async () => {
    try {
      const data = await certificationAPI.listAdminCertification();
      setCertifications(data || []);
    } catch (err) {
      error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const loadCertification = async (certId) => {
    try {
      const cert = await certificationAPI.getAdminCertificationById(certId);
      setFormData({
        title: cert.title || '',
        slug: cert.slug || '',
        heroSubtitle: cert.heroSubtitle || '',
        shortDescription: cert.shortDescription || '',
        description: cert.description || '',
        sortOrder: cert.sortOrder || 0,
        isActive: cert.isActive !== undefined ? cert.isActive : true,
      });
      setCardImagePreview(cert.cardImageUrl ? toAbsoluteMediaUrl(cert.cardImageUrl) : '');
      setCardImageFile(null);
      setHeroImagePreview(cert.heroImageUrl ? toAbsoluteMediaUrl(cert.heroImageUrl) : '');
      setHeroImageFile(null);
      setInnerImagePreview(cert.innerImageUrl ? toAbsoluteMediaUrl(cert.innerImageUrl) : '');
      setInnerImageFile(null);
      setOpenDialog(true);
    } catch (err) {
      error('Failed to load certification');
      navigate('/admin/certification');
    }
  };

  const handleSave = async () => {
    // Client-side validation
    if (!formData.title || !formData.title.trim()) {
      error('Title is required');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add fields with EXACT keys matching backend
      formDataToSend.append('title', formData.title.trim());
      
      if (formData.slug && formData.slug.trim()) {
        formDataToSend.append('slug', formData.slug.trim());
      }
      
      if (formData.heroSubtitle && formData.heroSubtitle.trim()) {
        formDataToSend.append('heroSubtitle', formData.heroSubtitle.trim());
      }
      
      if (formData.shortDescription && formData.shortDescription.trim()) {
        formDataToSend.append('shortDescription', formData.shortDescription.trim());
      }
      
      if (formData.description && formData.description.trim()) {
        formDataToSend.append('description', formData.description.trim());
      }
      
      formDataToSend.append('sortOrder', String(formData.sortOrder || 0));
      formDataToSend.append('isActive', String(formData.isActive !== false));
      
      // Add image files if selected
      if (cardImageFile && cardImageFile instanceof File) {
        formDataToSend.append('cardImage', cardImageFile);
      }
      
      if (heroImageFile && heroImageFile instanceof File) {
        formDataToSend.append('heroImage', heroImageFile);
      }
      
      if (innerImageFile && innerImageFile instanceof File) {
        formDataToSend.append('innerImage', innerImageFile);
      }

      if (id && id !== 'new') {
        // Update existing certification
        await certificationAPI.updateAdminCertification(id, formDataToSend);
        success('Certification updated successfully');
      } else {
        // Create new certification
        await certificationAPI.createAdminCertification(formDataToSend);
        success('Certification created successfully');
      }
      
      // Reset form and close dialog
      setOpenDialog(false);
      resetForm();
      navigate('/admin/certification');
      loadCertifications();
    } catch (err) {
      console.error('[handleSave] Error:', err);
      
      // Extract detailed error message
      let errorMessage = 'Failed to save certification';
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
      await certificationAPI.deleteAdminCertification(deleteId);
      success('Certification deleted successfully');
      setDeleteId(null);
      loadCertifications();
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to delete certification');
    }
  };

  const handleImageChange = (type, e) => {
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

      if (type === 'card') {
        setCardImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCardImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === 'hero') {
        setHeroImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setHeroImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === 'inner') {
        setInnerImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setInnerImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleToggleActive = async (row, newStatus) => {
    try {
      await certificationAPI.toggleAdminCertificationActive(row._id || row.id, newStatus);
      success('Certification status updated successfully');
      loadCertifications();
    } catch (err) {
      error(err.response?.data?.message || err.message || 'Failed to update certification status');
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
          title="Certification"
          subtitle="Manage certification programs and content"
          primaryAction={() => navigate('/admin/certification/new')}
          primaryActionLabel="Create New"
        />

        <SmartTable
          rows={certifications}
          columns={columns}
          loading={loading}
          searchFields={['title', 'slug', 'heroSubtitle', 'shortDescription']}
          onEdit={(row) => navigate(`/admin/certification/${row._id || row.id}`)}
          onDelete={(row) => setDeleteId(row._id || row.id)}
          onToggleActive={handleToggleActive}
          activeField="isActive"
          imageField="cardImageUrl"
          emptyMessage="No certifications found. Create your first certification to get started."
        />

        <Dialog 
          open={openDialog} 
          onClose={() => {
            setOpenDialog(false);
            resetForm();
            navigate('/admin/certification');
          }} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              {id === 'new' ? 'Create Certification' : 'Edit Certification'}
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
                  helperText="Certification title (required)"
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
                  label="Hero Subtitle"
                  value={formData.heroSubtitle || ''}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  margin="normal"
                  helperText="Subtitle shown in hero section (optional)"
                />
                
                <TextField
                  fullWidth
                  label="Short Description"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  margin="normal"
                  multiline
                  rows={3}
                  helperText="Brief description for list cards (optional)"
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
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Card Image
                  </Typography>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => handleImageChange('card', e)}
                    style={{ display: 'none' }}
                    id="card-image-upload"
                  />
                  <label htmlFor="card-image-upload">
                    <Button variant="outlined" component="span" disabled={uploading} fullWidth>
                      {cardImageFile ? 'Change Card Image' : 'Upload Card Image'}
                    </Button>
                  </label>
                  {(cardImagePreview || formData.cardImageUrl) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Image Preview:
                      </Typography>
                      <Box
                        component="img"
                        src={cardImagePreview || toAbsoluteMediaUrl(formData.cardImageUrl || '')}
                        alt="Card image preview"
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

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Hero Image
                  </Typography>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => handleImageChange('hero', e)}
                    style={{ display: 'none' }}
                    id="hero-image-upload"
                  />
                  <label htmlFor="hero-image-upload">
                    <Button variant="outlined" component="span" disabled={uploading} fullWidth>
                      {heroImageFile ? 'Change Hero Image' : 'Upload Hero Image'}
                    </Button>
                  </label>
                  {(heroImagePreview || formData.heroImageUrl) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Image Preview:
                      </Typography>
                      <Box
                        component="img"
                        src={heroImagePreview || toAbsoluteMediaUrl(formData.heroImageUrl || '')}
                        alt="Hero image preview"
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

                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Inner Image
                  </Typography>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => handleImageChange('inner', e)}
                    style={{ display: 'none' }}
                    id="inner-image-upload"
                  />
                  <label htmlFor="inner-image-upload">
                    <Button variant="outlined" component="span" disabled={uploading} fullWidth>
                      {innerImageFile ? 'Change Inner Image' : 'Upload Inner Image'}
                    </Button>
                  </label>
                  {(innerImagePreview || formData.innerImageUrl) && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Image Preview:
                      </Typography>
                      <Box
                        component="img"
                        src={innerImagePreview || toAbsoluteMediaUrl(formData.innerImageUrl || '')}
                        alt="Inner image preview"
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
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => {
                setOpenDialog(false);
                resetForm();
                navigate('/admin/certification');
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
          title="Delete Certification"
          message="Are you sure you want to delete this certification?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

        <ToastComponent />
      </Box>
    </PageTransition>
  );
}
