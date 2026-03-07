import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  School,
  CheckCircle,
  Cancel,
  People,
  AssignmentInd
} from '@mui/icons-material';
import * as adminEndpoints from '../api/adminEndpoints';

const StatCard = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        height: '100%',
        bgcolor: alpha(color, 0.05),
        border: '1px solid',
        borderColor: alpha(color, 0.1),
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: color,
            color: 'white',
            display: 'flex',
            boxShadow: `0 8px 16px ${alpha(color, 0.3)}`
          }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    availableCourses: 0,
    unavailableCourses: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [courses, registrations] = await Promise.all([
          adminEndpoints.fetchAdminCourses(),
          adminEndpoints.fetchCourseRegistrations()
        ]);

        const available = courses.filter(c => c.isAvailable !== false).length;
        const pending = registrations.filter(r => r.status === 'pending').length;

        setStats({
          totalCourses: courses.length,
          availableCourses: available,
          unavailableCourses: courses.length - available,
          totalRegistrations: registrations.length,
          pendingRegistrations: pending
        });
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress thickness={5} size={60} sx={{ color: 'primary.main', borderRadius: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, color: '#1a2035' }}>
          Overview Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
          Welcome back! Here's what's happening with your center today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<School />}
            color="#6366f1"
            subtitle="Catalog size"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Available Now"
            value={stats.availableCourses}
            icon={<CheckCircle />}
            color="#10b981"
            subtitle="Open for enrollment"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Coming Soon"
            value={stats.unavailableCourses}
            icon={<Cancel />}
            color="#f59e0b"
            subtitle="Catalog preview"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Registrations"
            value={stats.totalRegistrations}
            icon={<People />}
            color="#f59e0b"
            subtitle="Total student interest"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Pending"
            value={stats.pendingRegistrations}
            icon={<AssignmentInd />}
            color="#8b5cf6"
            subtitle="Needs your approval"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Course Availability Insights
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#10b981', 0.05), borderLeft: '4px solid #10b981' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#047857' }}>
                    Available Now
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You have {stats.availableCourses} courses live and accepting students.
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#f59e0b', 0.05), borderLeft: '4px solid #f59e0b' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#92400e' }}>
                    Coming Soon
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.unavailableCourses} courses are currently marked as "Coming Soon". They remain visible on the site but enrollment is paused.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', alignItems: 'center', bgcolor: 'grey.50', borderRadius: 3, p: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1, textAlign: 'center' }}>
                  Availability Ratio
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={stats.totalCourses > 0 ? (stats.availableCourses / stats.totalCourses) * 100 : 0}
                    size={120}
                    thickness={8}
                    sx={{ color: '#10b981' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h5" component="div" sx={{ fontWeight: 800 }}>
                      {stats.totalCourses > 0 ? Math.round((stats.availableCourses / stats.totalCourses) * 100) : 0}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
                  Percentage of your courses open for registration.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
