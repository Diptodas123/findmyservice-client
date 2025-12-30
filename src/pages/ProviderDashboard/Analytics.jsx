import { useState, useEffect, useMemo } from 'react';
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
  Divider,
  CircularProgress,
  Alert,
  Button
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
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';

const Analytics = ({ provider }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch analytics data from APIs
  useEffect(() => {
    if (provider?.providerId) {
      fetchAnalyticsData();
    }
  }, [provider?.providerId, fetchAnalyticsData]);

  const fetchAnalyticsData = async () => {
    if (!provider?.providerId) {
      setError('Provider information not available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all analytics data in parallel
      const [bookingsData, reviewsData, servicesData] = await Promise.all([
        // Fetch provider bookings/orders
        apiClient.get(`/api/v1/orders/provider/${provider.providerId}`).catch(err => {
          console.warn('Failed to fetch bookings:', err);
          return [];
        }),
        // Fetch provider reviews/feedback
        apiClient.get(`/api/v1/feedbacks/provider/${provider.providerId}`).catch(err => {
          console.warn('Failed to fetch reviews:', err);
          return [];
        }),
        // Fetch provider services
        apiClient.get(`/api/v1/services/provider/${provider.providerId}`).catch(err => {
          console.warn('Failed to fetch services:', err);
          return [];
        })
      ]);

      // Normalize data
      const normalizedBookings = Array.isArray(bookingsData) ? bookingsData : [];
      const normalizedReviews = Array.isArray(reviewsData) ? reviewsData : [];
      
      // Normalize services data similar to ServicesList component
      const rawServices = Array.isArray(servicesData) ? servicesData : (servicesData?.data || []);
      const normalizedServices = rawServices.map((d) => ({
        id: d.serviceId ?? d.id,
        name: d.serviceName ?? d.name,
        providerId: typeof d.providerId === 'object' ? (d.providerId?.providerId ?? d.providerId) : d.providerId,
        cost: d.cost ?? d.price ?? 0,
        imageUrl: d.imageUrl ?? d.image_url ?? '',
        description: d.description ?? '',
        availability: d.availability ?? 'AVAILABLE',
        active: d.active !== undefined ? d.active : true,
        avgRating: d.avgRating ?? d.avg_rating ?? 0,
        totalRatings: d.totalRatings ?? d.total_ratings ?? 0,
      }));

      setBookings(normalizedBookings);
      setReviews(normalizedReviews);
      setServices(normalizedServices);
      
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
      toastMessage({ msg: 'Failed to load analytics data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics from real data
  const analytics = useMemo(() => {
    if (loading || !bookings.length) {
      return {
        thisMonthRevenue: 0,
        revenueChange: 0,
        totalBookings: 0,
        thisMonthBookings: 0,
        bookingsChange: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        avgRating: 0,
        totalReviews: 0,
        recentReviews: 0,
        totalRevenue: 0,
        topServices: []
      };
    }

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    // Filter bookings for this month and last month
    const thisMonthBookings = bookings.filter(b => {
      const date = new Date(b.createdAt || b.orderDate);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

    const lastMonthBookings = bookings.filter(b => {
      const date = new Date(b.createdAt || b.orderDate);
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    // Calculate revenue from service base prices × monthly booking counts
    let thisMonthRevenue = 0;
    let lastMonthRevenue = 0;
    
    // We'll calculate these after processing all bookings

    const revenueChange = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate booking statistics
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => 
      (b.orderStatus && b.orderStatus.toLowerCase() === 'pending') || 
      (b.orderStatus && b.orderStatus === 'REQUESTED')
    ).length;
    const confirmedBookings = bookings.filter(b => 
      (b.orderStatus && ['confirmed', 'scheduled', 'paid'].includes(b.orderStatus.toLowerCase())) ||
      (b.orderStatus && ['SCHEDULED', 'PAID'].includes(b.orderStatus))
    ).length;
    const completedBookings = bookings.filter(b => 
      (b.orderStatus && b.orderStatus.toLowerCase() === 'completed') ||
      (b.orderStatus === 'COMPLETED')
    ).length;
    const cancelledBookings = bookings.filter(b => 
      (b.orderStatus && b.orderStatus.toLowerCase() === 'cancelled') ||
      (b.orderStatus === 'CANCELLED')
    ).length;

    const bookingsChange = lastMonthBookings.length > 0
      ? ((thisMonthBookings.length - lastMonthBookings.length) / lastMonthBookings.length) * 100
      : 0;

    // Calculate review statistics
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

    // Recent reviews (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentReviews = reviews.filter(r => 
      new Date(r.createdAt) > thirtyDaysAgo
    ).length;

    // Calculate total revenue (all time) from service base prices × booking counts
    let totalRevenue = 0;

    // Service performance analysis - Enhanced with actual service data
    const serviceStats = {};
    
    // Create a service lookup map by ID for faster access
    const serviceById = {};
    services.forEach(service => {
      serviceById[service.id] = service;
      const serviceKey = service.name || 'Unknown Service';
      serviceStats[serviceKey] = {
        id: service.id,
        name: serviceKey,
        count: 0,
        revenue: 0,
        basePrice: service.cost || 0,
        imageUrl: service.imageUrl,
        description: service.description,
        avgRating: service.avgRating || 0,
        totalRatings: service.totalRatings || 0,
        hasBookings: false
      };
    });
    
    // Then, populate with booking data using proper service ID mapping
    const serviceMonthlyStats = {};
    
    bookings.forEach(booking => {
      let serviceName = 'Unknown Service';
      let serviceId = null;
      
      // Try multiple ways to extract serviceId from booking
      if (booking.serviceId) {
        if (typeof booking.serviceId === 'object' && booking.serviceId.serviceId) {
          serviceId = booking.serviceId.serviceId;
        } else if (typeof booking.serviceId === 'number') {
          serviceId = booking.serviceId;
        }
      }
      
      // Try to get service name from serviceId mapping first
      if (serviceId && serviceById[serviceId]) {
        serviceName = serviceById[serviceId].name;
      } 
      // Fallback to direct serviceName from booking
      else if (booking.serviceName) {
        serviceName = booking.serviceName;
      }
      // Try nested service object with serviceName
      else if (booking.service?.serviceName) {
        serviceName = booking.service.serviceName;
      }
      // Try if serviceId object has serviceName
      else if (typeof booking.serviceId === 'object' && booking.serviceId?.serviceName) {
        serviceName = booking.serviceId.serviceName;
      }
      
      if (!serviceStats[serviceName]) {
        // If service from booking isn't in our services list, create a basic entry
        serviceStats[serviceName] = { 
          name: serviceName,
          count: 0, 
          revenue: 0,
          basePrice: 0, // We don't have base price for unknown services
          hasBookings: true
        };
      }
      
      if (!serviceMonthlyStats[serviceName]) {
        serviceMonthlyStats[serviceName] = {
          thisMonth: 0,
          lastMonth: 0,
          basePrice: serviceStats[serviceName].basePrice || 0
        };
      }

      serviceStats[serviceName].count++;
      serviceStats[serviceName].hasBookings = true;
      
      // Count monthly bookings for revenue calculation
      const bookingDate = new Date(booking.createdAt || booking.orderDate);
      if (bookingDate.getMonth() === thisMonth && bookingDate.getFullYear() === thisYear) {
        serviceMonthlyStats[serviceName].thisMonth++;
      } else if (bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === lastMonthYear) {
        serviceMonthlyStats[serviceName].lastMonth++;
      }
      
      // Don't add booking amount here - we'll calculate from base price × count
    });

    // Calculate revenue for each service: basePrice × booking count
    Object.values(serviceStats).forEach(service => {
      if (service.hasBookings && service.count > 0) {
        service.revenue = service.basePrice * service.count;
      }
    });

    // Calculate monthly revenues
    Object.entries(serviceMonthlyStats).forEach(([, monthlyData]) => {
      thisMonthRevenue += monthlyData.basePrice * monthlyData.thisMonth;
      lastMonthRevenue += monthlyData.basePrice * monthlyData.lastMonth;
    });

    // Create top services list with enhanced data
    const topServices = Object.values(serviceStats)
      .filter(service => service.hasBookings) // Only show services with actual bookings
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
      
    // Also create a list of all services for additional insights
    const allServices = Object.values(serviceStats);

    // Calculate total revenue from all services
    totalRevenue = allServices.reduce((sum, service) => sum + service.revenue, 0);

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
      topServices,
      allServices,
      totalServices: services.length,
      servicesWithBookings: allServices.filter(s => s.hasBookings).length
    };
  }, [bookings, reviews, loading, services]);

  const StatCard = ({ title, value, subtitle, color = 'primary', trend }) => (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>Analytics Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your business performance
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={fetchAnalyticsData}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : undefined}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button size="small" onClick={fetchAnalyticsData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Analytics Content */}
      {!loading && !error && (
        <>
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
                subtitle={`${analytics.totalBookings > 0 ? ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(0) : 0}% completion rate`}
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
                        {analytics.totalBookings > 0 ? ((analytics.completedBookings / analytics.totalBookings) * 100).toFixed(0) : 0}%
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Top Performing Services */}
          {analytics.topServices.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Top Performing Services</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {analytics.topServices.map((service, index) => (
                    <Box key={service.name || index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                          <Chip 
                            label={`#${index + 1}`} 
                            size="small" 
                            color="primary" 
                            sx={{ minWidth: 40 }}
                          />
                          {service.imageUrl && (
                            <Avatar 
                              src={service.imageUrl} 
                              alt={service.name}
                              sx={{ width: 32, height: 32 }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {service.name}
                            </Typography>
                            {service.basePrice && (
                              <Typography variant="caption" color="text.secondary">
                                Base Price: ₹{service.basePrice.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: 150 }}>
                          <Typography variant="body2" color="text.secondary">
                            {service.count} bookings
                          </Typography>
                          <Typography variant="body1" fontWeight={700} color="success.main">
                            ₹{service.revenue.toLocaleString()}
                          </Typography>
                          {service.count > 0 && service.revenue > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              Avg: ₹{Math.round(service.revenue / service.count).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={analytics.totalRevenue > 0 ? (service.revenue / analytics.totalRevenue) * 100 : 0} 
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}



          {/* No Data State */}
          {analytics.totalBookings === 0 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              No booking data available yet. Analytics will appear once you start receiving orders.
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};

export default Analytics;
