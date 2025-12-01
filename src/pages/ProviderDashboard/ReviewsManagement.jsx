import { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Rating,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import toastMessage from '../../utils/toastMessage';

const ReviewsManagement = ({ provider }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star

  // Fetch feedbacks when component mounts or provider changes
  useEffect(() => {
    if (provider?.providerId) {
      fetchFeedbacks();
    }
  }, [provider?.providerId]);

  const fetchFeedbacks = async () => {
    if (!provider?.providerId) {
      toastMessage({ msg: 'Provider information not available', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/feedbacks/provider/${provider.providerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const feedbacks = await response.json();
      
      // Fetch additional details for each feedback
      const enrichedFeedbacks = await Promise.all(
        feedbacks.map(async (feedback) => {
          try {
            // Fetch user details
            let userDetails = null;
            if (feedback.userId) {
              try {
                const userResponse = await fetch(`http://localhost:8080/api/v1/users/${feedback.userId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                });
                if (userResponse.ok) {
                  userDetails = await userResponse.json();
                }
              } catch (error) {
                console.warn('Failed to fetch user details:', error);
              }
            }

            // Fetch service details
            let serviceDetails = null;
            if (feedback.serviceId) {
              try {
                const serviceResponse = await fetch(`http://localhost:8080/api/v1/services/${feedback.serviceId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                  },
                });
                if (serviceResponse.ok) {
                  serviceDetails = await serviceResponse.json();
                }
              } catch (error) {
                console.warn('Failed to fetch service details:', error);
              }
            }

            // Transform feedback data with enriched details
            return {
              feedbackId: feedback.feedbackId,
              rating: parseFloat(feedback.rating) || 0,
              comment: feedback.comment || '',
              createdAt: feedback.createdAt,
              userId: {
                name: userDetails?.name || 'Anonymous User',
                email: userDetails?.email || '',
                profilePictureUrl: userDetails?.profilePictureUrl || ''
              },
              serviceId: {
                serviceName: serviceDetails?.serviceName || 'Unknown Service',
                serviceId: feedback.serviceId
              },
              // Store original references for potential future use
              originalUser: userDetails,
              originalService: serviceDetails,
              originalFeedback: feedback,
            };
          } catch (error) {
            console.error('Error enriching feedback data:', error);
            // Return basic feedback data if enrichment fails
            return {
              feedbackId: feedback.feedbackId,
              rating: parseFloat(feedback.rating) || 0,
              comment: feedback.comment || '',
              createdAt: feedback.createdAt,
              userId: {
                name: 'Anonymous User',
                email: '',
                profilePictureUrl: ''
              },
              serviceId: {
                serviceName: 'Unknown Service',
                serviceId: feedback.serviceId
              },
              originalFeedback: feedback,
            };
          }
        })
      );

      setReviews(enrichedFeedbacks);
      toastMessage({ msg: 'Feedbacks loaded successfully', type: 'success' });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toastMessage({ msg: 'Failed to load feedbacks. Please try again.', type: 'error' });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = Array.isArray(reviews) ? reviews.length : 0;
    const avgRating = total ? (reviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / total) : 0;

    const ratingDistribution = {
      5: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 5).length : 0,
      4: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 4).length : 0,
      3: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 3).length : 0,
      2: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 2).length : 0,
      1: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 1).length : 0,
    };

    return { total, avgRating, ratingDistribution };
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let filtered = Array.isArray(reviews) ? [...reviews] : [];

    // Filter by tab
    if (filterTab.endsWith('star')) {
      const rating = parseInt(filterTab[0]);
      filtered = filtered.filter(r => Number(r?.rating) === rating);
    }

    // Filter by search query
    if (searchQuery) {
      const query = String(searchQuery).toLowerCase();
      filtered = filtered.filter(r => 
        (String(r?.userId?.name || '')).toLowerCase().includes(query) ||
        (String(r?.comment || '')).toLowerCase().includes(query) ||
        (String(r?.serviceId?.serviceName || '')).toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first) without mutating original
    return filtered.slice().sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }, [reviews, filterTab, searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Reviews Management</Typography>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={fetchFeedbacks}
          disabled={loading}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {/* Statistics Overview */}
      {loading ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[...Array(2)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="80%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4">{stats.avgRating.toFixed(1)}</Typography>
                <Typography variant="body2">Average Rating</Typography>
                <Rating value={stats.avgRating} precision={0.1} readOnly sx={{ mt: 1, color: 'white' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4">{stats.total}</Typography>
                <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Rating Distribution */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Rating Distribution</Typography>
        {[5, 4, 3, 2, 1].map(rating => {
          const percent = stats.total ? (stats.ratingDistribution[rating] / stats.total) * 100 : 0;
          return (
            <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 80 }}>
                <Typography variant="body2">{rating}</Typography>
                <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={percent} 
                sx={{ flex: 1, height: 8, borderRadius: 1 }}
              />
              <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                {stats.ratingDistribution[rating]}
              </Typography>
            </Box>
          );
        })}
      </Card>

      {/* Filters and Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search reviews by customer, service, or comment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <Tabs 
          value={filterTab} 
          onChange={(e, val) => setFilterTab(val)} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={`All (${stats.total})`} value="all" />
          <Tab label={`5 Star (${stats.ratingDistribution[5]})`} value="5star" />
          <Tab label={`4 Star (${stats.ratingDistribution[4]})`} value="4star" />
          <Tab label={`3 Star (${stats.ratingDistribution[3]})`} value="3star" />
          <Tab label={`2 Star (${stats.ratingDistribution[2]})`} value="2star" />
          <Tab label={`1 Star (${stats.ratingDistribution[1]})`} value="1star" />
        </Tabs>
      </Box>

      {/* Reviews List */}
      <Stack spacing={2}>
        {loading ? (
          [...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="rectangular" width={120} height={32} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))
        ) : filteredReviews.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {reviews.length === 0 
                  ? "No reviews yet. Reviews will appear here once customers provide feedback." 
                  : "No reviews found matching your criteria."
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map(review => (
            <Card key={review.feedbackId}>
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Avatar src={review.userId?.profilePicture || ''} alt={review.userId?.name || 'User'} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {review?.userId?.name || 'Anonymous'}
                      </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Rating value={Number(review?.rating) || 0} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(review.createdAt)}
                      </Typography>
                      <Chip 
                          label={review.serviceId?.serviceName || 'Service'} 
                        size="small" 
                        variant="outlined"
                      />
                        {review.orderId?.orderId && (
                          <Chip 
                            label={`Order: ${review.orderId.orderId}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {review.comment}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
};

export default ReviewsManagement;
