// FIX: DashboardHome using theme tokens that break rendering (2024-12-19)
import { Box, Typography, Grid, Card, CardContent, CardHeader } from '@mui/material';
import {
  Slideshow,
  BusinessCenter,
  School,
  Handshake,
  Article,
  Mail,
} from '@mui/icons-material';
import PageTransition from '../components/PageTransition.jsx';

const stats = [
  { title: 'Hero Slides', icon: <Slideshow />, path: '/admin/hero-slides' },
  { title: 'Services', icon: <BusinessCenter />, path: '/admin/services' },
  { title: 'Courses', icon: <School />, path: '/admin/courses' },
  //   { title: 'Partners', icon: <Handshake />, path: '/admin/partners' },
  { title: 'Pages', icon: <Article />, path: '/admin/pages' },
  { title: 'Messages', icon: <Mail />, path: '/admin/contacts' },
];

export default function DashboardHome() {
  return (
    <PageTransition>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1e293b' }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#64748b' }}>
          Manage your site content and settings
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => (window.location.href = stat.path)}
              >
                <CardHeader
                  avatar={<Box sx={{ color: '#14b8a6' }}>{stat.icon}</Box>}
                  title={stat.title}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Click to manage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageTransition>
  );
}

