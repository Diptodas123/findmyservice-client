import { useState, useMemo } from 'react';
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
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  Reply as ReplyIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { MOCK_PROVIDER_REVIEWS } from '../../../mockData';

const ReviewsManagement = ({ provider }) => {
  const [reviews, setReviews] = useState(MOCK_PROVIDER_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // all, unanswered, answered, 5star, 4star, 3star, 2star, 1star
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = Array.isArray(reviews) ? reviews.length : 0;
    const answered = Array.isArray(reviews) ? reviews.filter(r => !!r?.providerResponse).length : 0;
    const unanswered = Math.max(0, total - answered);
    const avgRating = total ? (reviews.reduce((sum, r) => sum + (Number(r?.rating) || 0), 0) / total) : 0;

    const ratingDistribution = {
      5: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 5).length : 0,
      4: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 4).length : 0,
      3: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 3).length : 0,
      2: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 2).length : 0,
      1: Array.isArray(reviews) ? reviews.filter(r => Number(r?.rating) === 1).length : 0,
    };

    return { total, answered, unanswered, avgRating, ratingDistribution };
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let filtered = Array.isArray(reviews) ? [...reviews] : [];

    // Filter by tab
    if (filterTab === 'answered') {
      filtered = filtered.filter(r => !!r?.providerResponse);
    } else if (filterTab === 'unanswered') {
      filtered = filtered.filter(r => !r?.providerResponse);
    } else if (filterTab.endsWith('star')) {
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

  const handleOpenReply = (review) => {
    setSelectedReview(review);
    setReplyText(review.providerResponse || '');
    setReplyDialogOpen(true);
  };

  const handleCloseReply = () => {
    setReplyDialogOpen(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedReview) return;

    try {
      // TODO: API call to save response
      // await apiClient.post(`/api/v1/feedbacks/${selectedReview.feedbackId}/response`, { response: replyText });

      // Update locally
      setReviews(prev => prev.map(r => 
        r.feedbackId === selectedReview.feedbackId 
          ? { ...r, providerResponse: replyText }
          : r
      ));

      handleCloseReply();
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    }
  };

  const handleDeleteReply = async (reviewId) => {
    try {
      // TODO: API call to delete response
      // await apiClient.delete(`/api/v1/feedbacks/${reviewId}/response`);

      // Update locally
      setReviews(prev => prev.map(r => 
        r.feedbackId === reviewId 
          ? { ...r, providerResponse: null }
          : r
      ));
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Failed to delete reply. Please try again.');
    }
  };

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
      <Typography variant="h5" gutterBottom>Reviews Management</Typography>

      {/* Statistics Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4">{stats.avgRating.toFixed(1)}</Typography>
              <Typography variant="body2">Average Rating</Typography>
              <Rating value={stats.avgRating} precision={0.1} readOnly sx={{ mt: 1, color: 'white' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main">{stats.answered}</Typography>
              <Typography variant="body2" color="text.secondary">Answered</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main">{stats.unanswered}</Typography>
              <Typography variant="body2" color="text.secondary">Unanswered</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Tab label={`Unanswered (${stats.unanswered})`} value="unanswered" />
          <Tab label={`Answered (${stats.answered})`} value="answered" />
          <Tab label={`5 Star (${stats.ratingDistribution[5]})`} value="5star" />
          <Tab label={`4 Star (${stats.ratingDistribution[4]})`} value="4star" />
          <Tab label={`3 Star (${stats.ratingDistribution[3]})`} value="3star" />
          <Tab label={`2 Star (${stats.ratingDistribution[2]})`} value="2star" />
          <Tab label={`1 Star (${stats.ratingDistribution[1]})`} value="1star" />
        </Tabs>
      </Box>

      {/* Reviews List */}
      <Stack spacing={2}>
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                No reviews found
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

                {review.providerResponse ? (
                  <Box 
                    sx={{ 
                      bgcolor: 'grey.50', 
                      p: 2, 
                      borderRadius: 1, 
                      borderLeft: 3,
                      borderColor: 'primary.main'
                    }}
                  >
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Your Response
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {review.providerResponse}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button 
                        size="small" 
                        startIcon={<ReplyIcon />}
                        onClick={() => handleOpenReply(review)}
                      >
                        Edit Reply
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteReply(review.feedbackId)}
                      >
                        Delete Reply
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button 
                    variant="outlined" 
                    startIcon={<ReplyIcon />}
                    onClick={() => handleOpenReply(review)}
                  >
                    Reply to Review
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={handleCloseReply} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedReview?.providerResponse ? 'Edit Reply' : 'Reply to Review'}
        </DialogTitle>
        <DialogContent>
          {selectedReview && (
            <>
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2">{selectedReview?.userId?.name || 'Anonymous'}</Typography>
                  <Rating value={Number(selectedReview?.rating) || 0} size="small" readOnly />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {selectedReview.comment}
                </Typography>
              </Box>
              <TextField
                label="Your Response"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                multiline
                rows={4}
                fullWidth
                placeholder="Write a professional and helpful response..."
                helperText={`${replyText.length}/500 characters`}
                inputProps={{ maxLength: 500 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReply}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
          >
            {selectedReview?.providerResponse ? 'Update Reply' : 'Submit Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReviewsManagement;
