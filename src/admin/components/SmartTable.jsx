import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Edit, Delete } from '@mui/icons-material';
import { toAbsoluteMediaUrl } from '../../utils/mediaUrl.js';

function SmartTable({
  rows = [],
  columns = [],
  loading = false,
  searchFields = [],
  onEdit,
  onDelete,
  onToggleActive,
  activeField = 'isActive',
  imageField,
  emptyMessage = 'No data available',
  getRowId = (row) => row._id || row.id,
}) {
  const [searchText, setSearchText] = useState('');

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!searchText || searchFields.length === 0) {
      return rows;
    }

    const searchLower = searchText.toLowerCase();
    return rows.filter((row) => {
      return searchFields.some((field) => {
        const value = row[field];
        return value && String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [rows, searchText, searchFields]);

  // Enhanced columns with actions
  const enhancedColumns = useMemo(() => {
    const cols = [...columns];

    // Add image column if imageField is provided
    if (imageField && !cols.find((col) => col.field === imageField)) {
      cols.unshift({
        field: imageField,
        headerName: 'Image',
        width: 100,
        sortable: false,
        renderCell: (params) => {
          const imageUrl = params.value ? toAbsoluteMediaUrl(params.value) : '';
          return (
            <Avatar
              src={imageUrl}
              alt={params.row.title || params.row.name || 'Item'}
              variant="rounded"
              sx={{ width: 56, height: 56 }}
            />
          );
        },
      });
    }

    // Add active status chip if activeField exists
    if (activeField && !cols.find((col) => col.field === activeField)) {
      const activeColIndex = cols.findIndex((col) => col.field === 'actions');
      const insertIndex = activeColIndex >= 0 ? activeColIndex : cols.length;

      cols.splice(insertIndex, 0, {
        field: activeField,
        headerName: 'Status',
        width: 120,
        renderCell: (params) => {
          const isActive = params.value;
          return (
            <Chip
              label={isActive ? 'Active' : 'Inactive'}
              color={isActive ? 'success' : 'default'}
              size="small"
              sx={{
                fontWeight: 500,
                cursor: onToggleActive ? 'pointer' : 'default',
                '&:hover': onToggleActive ? {
                  opacity: 0.8,
                } : {},
              }}
              onClick={onToggleActive ? () => onToggleActive(params.row, !isActive) : undefined}
            />
          );
        },
      });
    }

    // Add actions column if onEdit or onDelete provided
    if ((onEdit || onDelete) && !cols.find((col) => col.field === 'actions')) {
      cols.push({
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(params.row)}
                aria-label="Edit"
              >
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(params.row)}
                aria-label="Delete"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        ),
      });
    }

    return cols;
  }, [columns, imageField, activeField, onEdit, onDelete, onToggleActive]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
      {searchFields.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>
      )}

      {filteredRows.length === 0 && !loading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 10,
            px: 2,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 1,
              fontWeight: 500,
            }}
          >
            {emptyMessage}
          </Typography>
          {searchText && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              No results found for "{searchText}"
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            height: 600,
            width: '100%',
            maxWidth: '100%',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={enhancedColumns}
            loading={loading}
            getRowId={getRowId}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              width: '100%',
              maxWidth: '100%',
              '& .MuiDataGrid-root': {
                width: '100%',
                maxWidth: '100%',
              },
              '& .MuiDataGrid-main': {
                width: '100%',
                maxWidth: '100%',
              },
              '& .MuiDataGrid-virtualScroller': {
                width: '100% !important',
                maxWidth: '100% !important',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-within': {
                  outline: 'none',
                },
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer',
                },
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                },
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.paper',
                borderBottom: '2px solid',
                borderColor: 'divider',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                },
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid',
                borderColor: 'divider',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default SmartTable;
