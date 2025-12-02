import { Box, Paper, Stack, Typography, Button, Rating, Chip, FormControl, InputLabel, Select, MenuItem, Divider, Avatar, CircularProgress, Alert, TextField } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewsList from '../ServiceProviderDetails/ReviewsList';
import { useDispatch, useSelector } from 'react-redux';
import { addItem as addItemAction } from '../../store/cartSlice';
import toastMessage from '../../utils/toastMessage';
import formatINR from '../../utils/formatCurrency';
import React, { useEffect, useState } from 'react';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch service details from API
    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem('token');
                console.log('Token value:', token, 'Type:', typeof token);

                // Fetch service details
                const serviceResponse = await fetch(`http://localhost:8080/api/v1/services/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && token !== 'null' && token !== 'undefined' ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                });

                if (!serviceResponse.ok) {
                    throw new Error(`HTTP error! status: ${serviceResponse.status}`);
                }

                const serviceData = await serviceResponse.json();

                if (!serviceData) {
                    throw new Error('Service not found');
                }

                setService(serviceData);

                // Fetch provider details if providerId exists
                if (serviceData.providerId) {
                    try {
                        const providerResponse = await fetch(`http://localhost:8080/api/v1/providers/${serviceData.providerId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                ...(token && token !== 'null' && token !== 'undefined' ? { 'Authorization': `Bearer ${token}` } : {}),
                            },
                        });

                        if (providerResponse.ok) {
                            const providerData = await providerResponse.json();
                            setProvider(providerData);
                        } else {
                            throw new Error(`Provider fetch failed: ${providerResponse.status}`);
                        }
                    } catch (providerErr) {
                        console.error('Error fetching provider:', providerErr);
                        // Set basic provider info from service data
                        setProvider({
                            providerId: serviceData.providerId,
                            providerName: 'Provider',
                            profilePictureUrl: '',
                            phone: null,
                            email: null,
                        });
                    }
                }

                // Fetch reviews for the service
                try {
                    const reviewsResponse = await fetch(`http://localhost:8080/api/v1/feedbacks/service/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token && token !== 'null' && token !== 'undefined' ? { 'Authorization': `Bearer ${token}` } : {}),
                        },
                    });

                    if (reviewsResponse.ok) {
                        const reviewsData = await reviewsResponse.json();

                        // Enrich reviews with user details
                        const enrichedReviews = await Promise.all(
                            (Array.isArray(reviewsData) ? reviewsData : []).map(async (review) => {
                                try {
                                    // Fetch user details
                                    let userDetails = null;
                                    if (review.userId) {
                                        const userResponse = await fetch(`http://localhost:8080/api/v1/users/${review.userId}`, {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                ...(token && token !== 'null' && token !== 'undefined' ? { 'Authorization': `Bearer ${token}` } : {}),
                                            },
                                        });
                                        if (userResponse.ok) {
                                            userDetails = await userResponse.json();
                                        }
                                    }

                                    // Transform review data with user details
                                    return {
                                        ...review,
                                        user: userDetails?.name || 'Anonymous User',
                                        image: userDetails?.profilePictureUrl || null,
                                        createdAt: review.createdAt || review.date || new Date().toISOString(),
                                        comment: review.comment || review.feedback || '',
                                        rating: review.rating || 0
                                    };
                                } catch (error) {
                                    console.warn('Failed to enrich review:', error);
                                    return {
                                        ...review,
                                        user: 'Anonymous User',
                                        image: null,
                                        createdAt: review.createdAt || review.date || new Date().toISOString(),
                                        comment: review.comment || review.feedback || '',
                                        rating: review.rating || 0
                                    };
                                }
                            })
                        );

                        setReviews(enrichedReviews);
                    } else {
                        console.log('No reviews found or error fetching reviews');
                        setReviews([]);
                    }
                } catch (reviewErr) {
                    console.error('Error fetching reviews:', reviewErr);
                    setReviews([]);
                }

            } catch (err) {
                console.error('Error fetching service details:', err);
                setError(err.message || 'Failed to load service details');
                // Don't show toast on initial load failure, just show error state
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchServiceDetails();
        }
    }, [id]);

    const handleCallProvider = () => {
        if (provider.phone) window.location.href = `tel:${provider.phone}`;
        else toastMessage({ msg: 'Provider phone not available', type: 'info' });
    };

    const handleEmailProvider = () => {
        if (provider.email) window.location.href = `mailto:${provider.email}`;
        else toastMessage({ msg: 'Provider email not available', type: 'info' });
    };
    const [reviewSort, setReviewSort] = React.useState('newest');
    const [expandedReviewIds, setExpandedReviewIds] = React.useState([]);

    // Review form state
    const [reviewRating, setReviewRating] = React.useState(0);
    const [reviewComment, setReviewComment] = React.useState('');
    const [submittingReview, setSubmittingReview] = React.useState(false);

    const sortedReviews = React.useMemo(() => {
        const arr = [...reviews];
        switch (reviewSort) {
            case 'newest':
                return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'highest':
                return arr.sort((a, b) => b.rating - a.rating);
            case 'lowest':
                return arr.sort((a, b) => a.rating - b.rating);
            default:
                return arr;
        }
    }, [reviews, reviewSort]);

    const dispatch = useDispatch();
    const items = useSelector((s) => s.cart.items || []);
    const user = useSelector((s) => s.user?.profile || null);

    const handleAddToCart = () => {
        if (!service) return;

        const exists = items.find((i) => i.serviceId === service.serviceId);
        if (exists) {
            toastMessage({ msg: `${service.serviceName || service.name} is already in cart`, type: 'info' });
            return;
        }

        const payload = {
            serviceId: service.serviceId || service.id,
            serviceName: service.serviceName || service.name,
            description: service.description,
            cost: service.cost || service.price,
            location: service.location || (provider ? `${provider.city || ''}${provider.state ? ', ' + provider.state : ''}` : ''),
            availability: service.availability,
            imageUrl: service.imageUrl,
            providerId: service.providerId?.providerId || service.providerId || provider?.providerId || provider?.id,
            providerName: provider?.providerName || provider?.name,
        };

        console.log('ServiceDetails - Adding to cart:', payload);
        dispatch(addItemAction(payload));
        toastMessage({ msg: `${service.serviceName || service.name} added to cart`, type: 'success' });
    };

    const handleSubmitReview = async () => {
        if (!user || !user.userId) {
            toastMessage({ msg: 'Please log in to submit a review', type: 'error' });
            return;
        }

        if (!reviewRating) {
            toastMessage({ msg: 'Please select a rating', type: 'warning' });
            return;
        }

        if (!reviewComment.trim()) {
            toastMessage({ msg: 'Please enter a review comment', type: 'warning' });
            return;
        }

        setSubmittingReview(true);
        try {
            const token = localStorage.getItem('token');
            
            const reviewPayload = {
                userId: user.userId,
                serviceId: service.serviceId,
                providerId: service.providerId,
                rating: reviewRating,
                comment: reviewComment.trim(),
                date: new Date().toISOString()
            };

            const response = await fetch('http://localhost:8080/api/v1/feedbacks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && token !== 'null' && token !== 'undefined' ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(reviewPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Reset form
            setReviewRating(0);
            setReviewComment('');

            toastMessage({ msg: 'Review submitted successfully!', type: 'success' });

            // Refresh reviews
            window.location.reload(); // Simple refresh - you could also re-fetch reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            toastMessage({
                msg: error.message || 'Failed to submit review. Please try again.',
                type: 'error'
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !service) {
        return (
            <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 8, md: 12 }, maxWidth: 1200, mx: 'auto' }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error || 'Service not found'}
                </Alert>
                <Button variant="contained" onClick={() => navigate('/search')}>
                    Back to Search
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 8, md: 12 }, maxWidth: 1200, mx: 'auto' }}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }} elevation={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ position: 'relative', flex: '0 0 420px' }}>
                        <Box component="img" src={service.imageUrl || 'https://via.placeholder.com/400x300?text=Service'} alt={service.serviceName || service.name} sx={{ width: '100%', height: { xs: 220, md: 380 }, objectFit: 'cover', display: 'block' }} />
                        <Box sx={{ position: 'absolute', left: 16, bottom: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'common.white', px: 2, py: 1, borderRadius: 1 }}>
                            <Typography variant="subtitle2">{service.serviceName || service.name}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Rating value={service.avgRating || 0} precision={0.1} readOnly size="small" sx={{ color: 'gold' }} />
                                <Typography variant="caption" sx={{ ml: 1 }}>{reviews.length} reviews</Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>{service.serviceName || service.name}</Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                                <Chip icon={<PlaceIcon />} label={service.location || (provider ? `${provider.city || ''}${provider.state ? ', ' + provider.state : ''}` : 'Location not available')} variant="outlined" sx={{ borderRadius: 2 }} />
                                <Chip icon={<AccessTimeIcon />} label={service.availability || 'Contact for availability'} variant="outlined" sx={{ borderRadius: 2 }} />
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="body1" color="text.secondary">{service.description || 'No description available'}</Typography>

                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{formatINR(service.cost || service.price || 0)}</Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                                <Button variant="contained" size="large" startIcon={<AddShoppingCartIcon />} onClick={handleAddToCart} sx={{ px: 3, py: 1.5, boxShadow: 3 }}>
                                    Add to Cart
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Paper>
            <Box sx={{ display: 'flex', gap: 3, mt: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flex: 1 }}>
                    {/* Add Review Form */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Write a Review</Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Rating *</Typography>
                                <Rating
                                    value={reviewRating}
                                    onChange={(event, newValue) => setReviewRating(newValue)}
                                    size="large"
                                    precision={1}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Comment *</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Share your experience with this service..."
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    variant="outlined"
                                    disabled={submittingReview}
                                />
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview || !reviewRating || !reviewComment.trim()}
                                    sx={{ px: 3, py: 1 }}
                                >
                                    {submittingReview ? (
                                        <>
                                            <CircularProgress size={16} sx={{ mr: 1 }} />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Review'
                                    )}
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Reviews List */}
                    {/* Reviews List */}
                    <Paper sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Customer Reviews ({reviews.length})</Typography>
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                                <InputLabel id="sd-review-sort">Sort</InputLabel>
                                <Select labelId="sd-review-sort" label="Sort" value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                                    <MenuItem value="newest">Newest</MenuItem>
                                    <MenuItem value="oldest">Oldest</MenuItem>
                                    <MenuItem value="highest">Highest Rating</MenuItem>
                                    <MenuItem value="lowest">Lowest Rating</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        <Box sx={{ mt: 2 }}>
                            <ReviewsList reviews={sortedReviews} expandedReviewIds={expandedReviewIds} toggleExpand={(id) => setExpandedReviewIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ width: { xs: '100%', md: 320 }, alignSelf: 'flex-start' }}>
                    <Paper sx={{ position: { md: 'sticky' }, top: 96, p: 2, borderRadius: 2, boxShadow: 3 }} elevation={2}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar src={provider?.profilePictureUrl} alt={provider?.providerName || 'Provider'} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{provider?.providerName || 'Service Provider'}</Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <Rating value={service.avgRating || provider?.avgRating || 0} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">{reviews.length} ratings</Typography>
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{service.serviceName || service.name}</Typography>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatINR(service.cost || service.price || 0)}</Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button variant="contained" startIcon={<PhoneIcon />} onClick={handleCallProvider}>
                                    Call
                                </Button>
                                <Button variant="outlined" startIcon={<EmailIcon />} onClick={handleEmailProvider}>
                                    Email
                                </Button>
                            </Stack>

                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default ServiceDetails;