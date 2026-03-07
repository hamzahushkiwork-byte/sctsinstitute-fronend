import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import adminClient from '../../api/adminClient.js';
import { toAbsoluteMediaUrl } from '../../utils/mediaUrl.js';

export default function HeroSlideFormDialog({ open, slide, onClose, onSave }) {
  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    subtitle: '',
    mediaUrl: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slide) {
      setFormData({
        type: slide.type || 'image',
        title: slide.title || '',
        subtitle: slide.subtitle || '',
        mediaUrl: slide.mediaUrl || '',
        buttonText: slide.buttonText || '',
        buttonLink: slide.buttonLink || '',
        order: slide.order || 0,
        isActive: slide.isActive !== false,
      });
    } else {
      setFormData({
        type: 'image',
        title: '',
        subtitle: '',
        mediaUrl: '',
        buttonText: '',
        buttonLink: '',
        order: 0,
        isActive: true,
      });
    }
    setError('');
  }, [slide, open]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await adminClient.post('/admin/uploads', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success && response.data?.data?.url) {
        setFormData({ ...formData, mediaUrl: response.data.data.url });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (slide) {
        await adminClient.put(`/admin/hero-slides/${slide._id || slide.id}`, formData);
      } else {
        await adminClient.post('/admin/hero-slides', formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save slide');
    }
  };

  const isVideo = formData.mediaUrl && (
    formData.mediaUrl.includes('.mp4') ||
    formData.mediaUrl.includes('.webm') ||
    formData.mediaUrl.includes('.ogg') ||
    formData.mediaUrl.includes('.mov')
  );
  const mediaUrl = toAbsoluteMediaUrl(formData.mediaUrl || '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{slide ? 'Edit Hero Slide' : 'Add Hero Slide'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            label="Type"
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
          required
        />

        <TextField
          fullWidth
          label="Subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          margin="normal"
          multiline
          rows={2}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <input
            type="file"
            accept={formData.type === 'video' ? 'video/*' : 'image/*'}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outlined" component="span" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Media'}
            </Button>
          </label>
          {uploading && <LinearProgress sx={{ mt: 1 }} />}
        </Box>

        {formData.mediaUrl && (
          <Box sx={{ mt: 2, mb: 2 }}>
            {isVideo ? (
              <video src={mediaUrl} controls style={{ width: '100%', maxHeight: '300px', display: 'block' }} />
            ) : (
              <img 
                src={mediaUrl} 
                alt="Preview" 
                style={{ 
                  width: '100%', 
                  maxHeight: '300px', 
                  objectFit: 'contain',
                  display: 'block',
                  minHeight: '100px'
                }} 
                onError={(e) => {
                  console.error('[HeroSlideFormDialog] Image failed to load:', mediaUrl);
                  e.target.style.display = 'none';
                }}
              />
            )}
          </Box>
        )}

        <TextField
          fullWidth
          label="Media URL"
          value={formData.mediaUrl}
          onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
          margin="normal"
          helperText="Or paste URL directly"
        />

        <TextField
          fullWidth
          label="Button Text"
          value={formData.buttonText}
          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Button Link"
          value={formData.buttonLink}
          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          margin="normal"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          }
          label="Active"
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}



