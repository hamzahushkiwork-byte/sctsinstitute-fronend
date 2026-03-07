import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import adminClient from '../../api/adminClient.js';
import HeroSlideFormDialog from './HeroSlideFormDialog.jsx';

export default function HeroSlidesList() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const response = await adminClient.get('/admin/hero-slides');
      const sorted = (response.data?.data || []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setSlides(sorted);
    } catch (error) {
      console.error('Failed to load slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSlide(null);
    setOpenForm(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setOpenForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminClient.delete(`/admin/hero-slides/${deleteId}`);
      loadSlides();
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingSlide(null);
  };

  const handleFormSave = () => {
    loadSlides();
    handleFormClose();
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Hero Slides
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Slide
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : slides.length === 0 ? (
        <Typography sx={{ color: '#666' }}>No slides found. Click "Add Slide" to create one.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slides.map((slide) => (
                <TableRow key={slide._id || slide.id}>
                  <TableCell>
                    <Chip label={slide.type || 'image'} size="small" />
                  </TableCell>
                  <TableCell>{slide.title || '-'}</TableCell>
                  <TableCell>{slide.order || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={slide.isActive !== false ? 'Yes' : 'No'}
                      color={slide.isActive !== false ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(slide)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteId(slide._id || slide.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <HeroSlideFormDialog
        open={openForm}
        slide={editingSlide}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Slide</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this slide?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



