import { Box, Paper, Stack, Typography, Button, Rating, Chip, FormControl, InputLabel, Select, MenuItem, Divider, Avatar, CircularProgress, Alert } from '@mui/material';
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
import apiClient from '../../utils/apiClient';
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
                
                // Fetch service details
                const serviceResponse = await apiClient.get(`/api/v1/services/${id}`);
                const serviceData = serviceResponse.data || serviceResponse;
                
                if (!serviceData) {
                    throw new Error('Service not found');
                }
                
                setService(serviceData);
                
                // Fetch provider details if providerId exists
                if (serviceData.providerId) {
                    try {
                        const providerResponse = await apiClient.get(`/api/v1/providers/${serviceData.providerId}`);
                        const providerData = providerResponse.data || providerResponse;
                        setProvider(providerData);
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
                    const reviewsResponse = await apiClient.get(`/api/v1/services/${id}/reviews`);
                    const reviewsData = reviewsResponse.data || reviewsResponse;
                    setReviews(Array.isArray(reviewsData) ? reviewsData : []);
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
            providerId: service.providerId,
            providerName: provider?.providerName,
        };

        dispatch(addItemAction(payload));
        toastMessage({ msg: `${service.serviceName || service.name} added to cart`, type: 'success' });
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
                    <Paper sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Reviews</Typography>
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