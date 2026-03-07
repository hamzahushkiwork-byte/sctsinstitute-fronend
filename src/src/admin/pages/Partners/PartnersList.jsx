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
  Avatar,
  LinearProgress,
  Link as MuiLink,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Edit, Delete, OpenInNew } from '@mui/icons-material';
import * as partnersAPI from '../../../services/partners.api.js';
import PageTransition from '../../components/PageTransition.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { toAbsoluteMediaUrl } from '../../../utils/mediaUrl.js';

export default function PartnersList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(!!id);
  const [formData, setFormData] = useState({
    link: '',
    sortOrder: 0,
    isActive: true,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadPartners();
    if (id && id !== 'new') {
      loadPartner(id);
    } else if (id === 'new') {
      setFormData({
        link: '',
        sortOrder: 0,
        isActive: true,
      });
      setLogoFile(null);
      setLogoPreview('');
      setOpenDialog(true);
    }
  }, [id]);

  const loadPartners = async () => {
    try {
      const data = await partnersAPI.getPartners();
      setPartners(data || []);
    } catch (error) {
      showSnackbar('Failed to load partners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPartner = async (partnerId) => {
    try {
      const partner = await partnersAPI.getPartnerById(partnerId);
      setFormData({
        link: partner.link || '',
        sortOrder: partner.sortOrder || 0,
        isActive: partner.isActive !== undefined ? partner.isActive : true,
      });
      setLogoPreview(partner.logoUrl || '');
      setLogoFile(null);
      setOpenDialog(true);
    } catch (error) {
      showSnackbar('Failed to load partner', 'error');
      navigate('/admin/partners');
    }
  };

  const handleSave = async () => {
    // Client-side validation
    if (!formData.link || !formData.link.trim()) {
      showSnackbar('Link is required', 'error');
      return;
    }

    // For new partners, logoFile is REQUIRED
    if (id === 'new' && !logoFile) {
      showSnackbar('Logo is required for new partners', 'error');
      return;
    }

    // Validate logoFile is a real File object
    if (id === 'new' && (!(logoFile instanceof File) || !logoFile.name)) {
      showSnackbar('Please select a valid image file', 'error');
      return;
    }

    try {
      setUploading(true);
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add required link
      formDataToSend.append('link', formData.link.trim());
      
      // Add sortOrder (number as string)
      formDataToSend.append('sortOrder', String(formData.sortOrder || 0));
      
      // Add isActive (boolean as string)
      formDataToSend.append('isActive', String(formData.isActive !== false));
      
      // Add logo file - REQUIRED for new partners, optional for updates
      if (logoFile && logoFile instanceof File) {
        formDataToSend.append('logo', logoFile);
      }

      if (id && id !== 'new') {
        // Update existing partner
        await partnersAPI.updatePartner(id, formDataToSend);
        showSnackbar('Partner updated successfully', 'success');
      } else {
        // Create new partner
        await partnersAPI.createPartner(formDataToSend);
        showSnackbar('Partner created successfully', 'success');
      }
      
      // Reset form and close dialog
      setOpenDialog(false);
      setLogoFile(null);
      setLogoPreview('');
      navigate('/admin/partners');
      loadPartners();
    } catch (error) {
      console.error('[handleSave] Error:', error);
      
      // Extract detailed error message
      let errorMessage = 'Failed to save partner';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await partnersAPI.deletePartner(deleteId);
      showSnackbar('Partner deleted successfully', 'success');
      setDeleteId(null);
      loadPartners();
    } catch (error) {
      showSnackbar(error.response?.data?.message || error.message || 'Failed to delete partner', 'error');
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('File size must be less than 5MB', 'error');
        return;
      }

      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const columns = [
    {
      field: 'logoUrl',
      headerName: 'Logo',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const logoUrl = params.value ? toAbsoluteMediaUrl(params.value) : '';
        return (
          <Avatar
            src={logoUrl}
            alt="Partner logo"
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          />
        );
      },
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 1,
      renderCell: (params) => {
        const link = params.value || '';
        return (
          <MuiLink
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {link}
            <OpenInNew fontSize="small" />
          </MuiLink>
        );
      },
    },
    { field: 'sortOrder', headerName: 'Order', width: 100 },
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
            onClick={() => navigate(`/admin/partners/${params.row._id || params.row.id}`)}
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
          <h2>Partners & Accreditations</h2>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/partners/new')}
          >
            Create New
          </Button>
        </Box>

        <DataGrid
          rows={partners}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          pageSizeOptions={[10, 25, 50]}
          sx={{ height: 600 }}
        />

        <Dialog open={openDialog} onClose={() => navigate('/admin/partners')} maxWidth="md" fullWidth>
          <DialogTitle>{id === 'new' ? 'Create Partner' : 'Edit Partner'}</DialogTitle>
          <DialogContent>
            {uploading && <LinearProgress sx={{ mb: 2 }} />}
            
            <TextField
              fullWidth
              label="Link"
              value={formData.link || ''}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              margin="normal"
              required
              helperText="Partner website URL (required)"
              placeholder="https://example.com"
            />
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
                id="logo-upload"
              />
              <label htmlFor="logo-upload">
                <Button variant="outlined" component="span" disabled={uploading}>
                  {logoFile ? 'Change Logo' : 'Upload Logo'}
                </Button>
              </label>
              {id === 'new' && !logoFile && !logoPreview && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Logo is required for new partners (png, jpg, jpeg, webp, svg - max 5MB)
                </Alert>
              )}
            </Box>
            
            {(logoPreview || formData.logoUrl) && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <img
                  src={logoPreview || toAbsoluteMediaUrl(formData.logoUrl || '')}
                  alt="Logo preview"
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
                setLogoFile(null);
                setLogoPreview('');
                navigate('/admin/partners');
              }} disabled={uploading}>
                Cancel
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={!!deleteId}
          title="Delete Partner"
          message="Are you sure you want to delete this partner?"
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
