import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  School,
  CheckCircle,
  Cancel,
  People,
  AssignmentInd,
  TrendingUp,
  Refresh,
  Mail,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import * as adminEndpoints from "../api/adminEndpoints";

const MotionCard = motion(Card);

const StatCard = ({ title, value, icon, color, subtitle, delay = 0 }) => {
  const theme = useTheme();

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
        boxShadow: `0 20px 25px -5px ${alpha(color, 0.1)}, 0 10px 10px -5px ${alpha(color, 0.04)}`,
      }}
      elevation={0}
      sx={{
        borderRadius: 5,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(color, 0.02)} 0%, ${alpha(color, 0.08)} 100%)`,
        border: "1px solid",
        borderColor: alpha(color, 0.1),
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
              color: "white",
              display: "flex",
              boxShadow: `0 8px 20px ${alpha(color, 0.3)}`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "inherit",
                background:
                  "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0))",
              },
            }}
          >
            {icon}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: alpha(color, 0.1),
              px: 1,
              py: 0.5,
              borderRadius: 2,
              color: color,
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
            Active
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 800,
              mb: 0.5,
              color: theme.palette.text.primary,
              letterSpacing: "-1px",
            }}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "0.7rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        {subtitle && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: alpha(color, 0.1),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: color,
                  mr: 1,
                }}
              />
              {subtitle}
            </Typography>
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );
};

export default function DashboardPage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    availableCourses: 0,
    unavailableCourses: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    totalMessages: 0,
    newMessages: 0,
  });

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [courses, registrations, messages] = await Promise.all([
        adminEndpoints.fetchAdminCourses(),
        adminEndpoints.fetchCourseRegistrations(),
        adminEndpoints.fetchContactMessages(),
      ]);

      const available = (courses || []).filter(
        (c) => c.isAvailable !== false,
      ).length;
      const pending = (registrations || []).filter(
        (r) => r.status === "pending",
      ).length;
      const newMsg = (messages || []).filter((m) => m.status === "new").length;

      setStats({
        totalCourses: (courses || []).length,
        availableCourses: available,
        unavailableCourses: (courses || []).length - available,
        totalRegistrations: (registrations || []).length,
        pendingRegistrations: pending,
        totalMessages: (messages || []).length,
        newMessages: newMsg,
      });
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          gap: 2,
        }}
      >
        <CircularProgress
          thickness={4}
          size={50}
          sx={{
            color: "primary.main",
            "& .MuiCircularProgress-circle": { strokeLinecap: "round" },
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          Gathering insights...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 5,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              background: "linear-gradient(45deg, #1e293b 30%, #475569 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-1.5px",
            }}
          >
            Academy Performance
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Visual overview of courses, students, and enrollment status.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={() => loadStats(true)}
              disabled={refreshing}
              sx={{
                bgcolor: "white",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": { bgcolor: "grey.50" },
              }}
            >
              <Refresh
                sx={{
                  animation: refreshing ? "spin 1s linear infinite" : "none",
                }}
              />
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      <Grid container spacing={4}>
        {[
          {
            title: "Total Catalog",
            value: stats.totalCourses,
            icon: <School />,
            color: "#6366f1",
            subtitle: "Total courses listed",
          },
          {
            title: "Active Courses",
            value: stats.availableCourses,
            icon: <CheckCircle />,
            color: "#10b981",
            subtitle: "Open for enrollment",
          },
          {
            title: "Upcoming",
            value: stats.unavailableCourses,
            icon: <Cancel />,
            color: "#f59e0b",
            subtitle: "Private/Preview mode",
          },
          {
            title: "Student Interest",
            value: stats.totalRegistrations,
            icon: <People />,
            color: "#8b5cf6",
            subtitle: "Lifetime registrations",
          },
          {
            title: "Needs Attention",
            value: stats.pendingRegistrations,
            icon: <AssignmentInd />,
            color: "#ef4444",
            subtitle: "Pending approvals",
          },
          {
            title: "New Inquiries",
            value: stats.newMessages,
            icon: <Mail />,
            color: "#06b6d4",
            subtitle: "Unread messages",
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <StatCard {...card} delay={index * 0.1} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 6,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(to right bottom, #ffffff, #f8fafc)",
                boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TrendingUp sx={{ mr: 1.5, color: "primary.main" }} />
                Academy Insights & Metrics
              </Typography>

              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Stack spacing={3}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: alpha("#10b981", 0.04),
                        borderLeft: "5px solid #10b981",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: alpha("#10b981", 0.07),
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#047857", mb: 0.5 }}
                      >
                        Operational Readiness
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        <strong>{stats.availableCourses}</strong> out of{" "}
                        <strong>{stats.totalCourses}</strong> courses are
                        currently live. Your catalog health is looking good!
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: alpha("#8b5cf6", 0.04),
                        borderLeft: "5px solid #8b5cf6",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: alpha("#8b5cf6", 0.07),
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#6d28d9", mb: 0.5 }}
                      >
                        Student Engagement
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        There are <strong>{stats.pendingRegistrations}</strong>{" "}
                        students waiting for approval. Prompt processing leads
                        to better conversion rates.
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 4,
                        bgcolor: alpha("#06b6d4", 0.04),
                        borderLeft: "5px solid #06b6d4",
                        transition: "all 0.3s",
                        "&:hover": {
                          bgcolor: alpha("#06b6d4", 0.07),
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#0891b2", mb: 0.5 }}
                      >
                        Communication Flux
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.7 }}
                      >
                        You have <strong>{stats.newMessages}</strong> unread
                        inquiries out of <strong>{stats.totalMessages}</strong>{" "}
                        total messages. Stay connected with your audience!
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                      alignItems: "center",
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                      borderRadius: 6,
                      p: 4,
                      border: "1px dashed",
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "text.secondary", mb: 3, fontWeight: 700 }}
                    >
                      Live Ratio
                    </Typography>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={160}
                        thickness={6}
                        sx={{ color: "grey.100", position: "absolute" }}
                      />
                      <CircularProgress
                        variant="determinate"
                        value={
                          stats.totalCourses > 0
                            ? (stats.availableCourses / stats.totalCourses) *
                              100
                            : 0
                        }
                        size={160}
                        thickness={6}
                        sx={{
                          color: "#10b981",
                          "& .MuiCircularProgress-circle": {
                            strokeLinecap: "round",
                          },
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h3"
                          component="div"
                          sx={{
                            fontWeight: 900,
                            color: "#10b981",
                            letterSpacing: "-2px",
                          }}
                        >
                          {stats.totalCourses > 0
                            ? Math.round(
                                (stats.availableCourses / stats.totalCourses) *
                                  100,
                              )
                            : 0}
                          %
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                            textTransform: "uppercase",
                          }}
                        >
                          Ready
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 4,
                        color: "text.secondary",
                        textAlign: "center",
                        maxWidth: 200,
                        fontWeight: 500,
                      }}
                    >
                      Percentage of the total course catalog currently available
                      for public enrollment.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
