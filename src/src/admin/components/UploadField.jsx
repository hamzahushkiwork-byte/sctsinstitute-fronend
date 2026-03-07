import { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Alert,
} from '@mui/material';
import { CloudUpload, Image as ImageIcon, VideoLibrary } from '@mui/icons-material';
import { uploadMedia } from '../utils/uploadMedia.js';
import { toAbsoluteMediaUrl } from '../../utils/mediaUrl.js';

export default function UploadField({
  label,
  value,
  onChange,
  accept = 'image/*',
  helperText,
  disabled = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);
    setError('');

    try {
      const url = await uploadMedia(file);
      onChange(url);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = value && (value.includes('.mp4') || value.includes('.webm') || value.includes('.ogg') || value.includes('.mov') || accept.includes('video'));
  const isImage = !isVideo;
  const mediaUrl = value ? toAbsoluteMediaUrl(value) : '';

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        helperText={error || helperText || 'Click button to upload or paste URL'}
        error={!!error}
        margin="normal"
        disabled={disabled || uploading}
        InputProps={{
          startAdornment: isVideo ? (
            <VideoLibrary sx={{ mr: 1, color: 'text.secondary' }} />
          ) : isImage && value ? (
            <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />
          ) : null,
        }}
      />
      <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
          disabled={disabled || uploading}
          sx={{ borderRadius: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" hidden accept={accept} onChange={handleFileChange} />
        </Button>
        {selectedFile && (
          <Typography variant="body2" color="text.secondary">
            {selectedFile.name}
          </Typography>
        )}
      </Box>
      {uploading && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {value && mediaUrl && !uploading && (
        <Box sx={{ mt: 2 }}>
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              muted
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                borderRadius: 8,
                backgroundColor: '#000',
              }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

