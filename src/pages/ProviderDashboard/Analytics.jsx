import { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { MOCK_BOOKINGS, MOCK_PROVIDER_REVIEWS } from '../../../mockData';

const Analytics = ({ provider }) => {
  // Calculate analytics from bookings
  const analytics = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Filter bookings for this month and last month
    const thisMonthBookings = MOCK_BOOKINGS.filter(b => {
      const date = new Date(b.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const lastMonthBookings = MOCK_BOOKINGS.filter(b => {
      const date = new Date(b.createdAt);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Calculate revenue
    const thisMonthRevenue = thisMonthBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    const lastMonthRevenue = lastMonthBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate bookings
    const totalBookings = MOCK_BOOKINGS.length;
    const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending').length;
    const confirmedBookings = MOCK_BOOKINGS.filter(b => b.status === 'confirmed').length;
    const completedBookings = MOCK_BOOKINGS.filter(b => b.status === 'completed').length;
    const cancelledBookings = MOCK_BOOKINGS.filter(b => b.status === 'cancelled').length;

    const bookingsChange = lastMonthBookings.length > 0
      ? ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100
      : 0;

    // Calculate average rating from reviews
    const totalReviews = MOCK_PROVIDER_REVIEWS.length;
    const avgRating = totalReviews > 0
      ? MOCK_PROVIDER_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentReviews = MOCK_PROVIDER_REVIEWS.filter(r => 
      new Date(r.createdAt) > thirtyDaysAgo
    ).length;

    // Calculate total revenue (all time)
    const totalRevenue = MOCK_BOOKINGS
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);

    // Service performance (bookings per service)
    const serviceStats = {};
    MOCK_BOOKINGS.forEach(booking => {
      if (!serviceStats[booking.serviceName]) {
        serviceStats[booking.serviceName] = { count: 0, revenue: 0 };
      }
      serviceStats[booking.serviceName].count++;
      if (booking.paymentStatus === 'paid') {
        serviceStats[booking.serviceName].revenue += booking.amount;
      }
    });

    const topServices = Object.entries(serviceStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      thisMonthRevenue,
      revenueChange,
      totalBookings,
      thisMonthBookings: thisMonthBookings.length,
      bookingsChange,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      avgRating,
      totalReviews,
      recentReviews,
      totalRevenue,
      topServices
    };
  }, []);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            <Icon />
          </Avatar>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend >= 0 ? (
              <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />
            ) : (
              <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ color: trend >= 0 ? 'success.main' : 'error.main' }}
            >
              {Math.abs(trend).toFixed(1)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Overview of your business performance
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${analytics.totalRevenue.toLocaleString()}`}
            subtitle={`₹${analytics.thisMonthRevenue.toLocaleString()} this month`}
            icon={MoneyIcon}
            color="success"
            trend={analytics.revenueChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bookings"
            value={analytics.totalBookings}
            subtitle={`${analytics.thisMonthBookings} this month`}
            icon={CalendarIcon}
            color="primary"
            trend={analytics.bookingsChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Rating"
            value={analytics.avgRating.toFixed(1)}
            subtitle={`${analytics.totalReviews} total reviews`}
            icon={StarIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed Jobs"
            value={analytics.completedBookings}
            subtitle={`${((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(0)}% completion rate`}
            icon={CheckCircleIcon}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Bookings Status Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Booking Status Overview</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="warning.dark">
                      {analytics.pendingBookings}
                    </Typography>
                    <Typography variant="body2" color="warning.dark">Pending</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="info.dark">
                      {analytics.confirmedBookings}
                    </Typography>
                    <Typography variant="body2" color="info.dark">Confirmed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="success.dark">
                      {analytics.completedBookings}
                    </Typography>
                    <Typography variant="body2" color="success.dark">Completed</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight={700} color="error.dark">
                      {analytics.cancelledBookings}
                    </Typography>
                    <Typography variant="body2" color="error.dark">Cancelled</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">New Reviews (30 days)</Typography>
                  <Typography variant="h5" fontWeight={700}>{analytics.recentReviews}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(0)}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performing Services */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Top Performing Services</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {analytics.topServices.map((service, index) => (
              <Box key={service.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      color="primary" 
                      sx={{ minWidth: 40 }}
                    />
                    <Typography variant="body1" fontWeight={600}>
                      {service.name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                    <Typography variant="body2" color="text.secondary">
                      {service.count} bookings
                    </Typography>
                    <Typography variant="body1" fontWeight={700} color="success.main">
                      ₹{service.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(service.revenue / analytics.totalRevenue) * 100} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
