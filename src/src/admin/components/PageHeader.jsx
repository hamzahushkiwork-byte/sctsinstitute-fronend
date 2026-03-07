import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

function PageHeader({ title, subtitle, primaryAction, primaryActionLabel = 'Create New', primaryActionIcon = <Add /> }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
        flexWrap: 'wrap',
        gap: 2,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: 'text.primary', 
            mb: 0.5,
            fontSize: { xs: '1.75rem', sm: '2rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              mt: 0.5,
              fontSize: '0.9375rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {primaryAction && (
        <Button
          variant="contained"
          startIcon={primaryActionIcon}
          onClick={primaryAction}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.25,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          }}
        >
          {primaryActionLabel}
        </Button>
      )}
    </Box>
  );
}

export default PageHeader;
