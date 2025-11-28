import { Box, Paper, Stack, Typography, Button, Rating, Chip, FormControl, InputLabel, Select, MenuItem, Divider, Avatar } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import { useParams } from 'react-router-dom';
import { MOCK_REVIEWS, MOCK_PROVIDER } from '../../../mockData';
import ReviewsList from '../ServiceProviderDetails/ReviewsList';
import { useDispatch, useSelector } from 'react-redux';
import { addItem as addItemAction } from '../../store/cartSlice';
import toastMessage from '../../utils/toastMessage';
import formatINR from '../../utils/formatCurrency';
import React from 'react';

const ServiceDetails = () => {
    const { id } = useParams();


    const serviceFromMock = (MOCK_PROVIDER && Array.isArray(MOCK_PROVIDER.services))
        ? MOCK_PROVIDER.services.find((s) => String(s.id) === String(id))
        : null;

    const service = (serviceFromMock
        ? {
            providerId: MOCK_PROVIDER.providerId,
            serviceName: serviceFromMock.name || serviceFromMock.serviceName || 'Service',
            description: serviceFromMock.description || 'No description available.',
            cost: serviceFromMock.cost ?? 49.99,
            location: `${MOCK_PROVIDER.city || ''}${MOCK_PROVIDER.state ? ', ' + MOCK_PROVIDER.state : ''}`,
            availability: serviceFromMock.availability || 'Mon-Fri 9:00-17:00',
            imageUrl: serviceFromMock.imageUrl || '',
            createdAt: serviceFromMock.createdAt || new Date().toISOString(),
            active: serviceFromMock.active ?? true,
            avgRating: MOCK_PROVIDER.avgRating ?? 0,
            totalRatings: MOCK_PROVIDER.totalRatings ?? 0,
            id: serviceFromMock.id,
        }
        : {
            providerId: id || '123',
            serviceName: 'Sample Service',
            description: 'This is a demo service description. Replace by navigation state or fetch from API.',
            cost: 49.99,
            location: 'Sample Location',
            availability: 'Mon-Fri 9:00-17:00',
            imageUrl: 'https://webtk.sfastservices.com/blogimg/Carpenter%20Services%20%20Near%20Me.jpg',
            createdAt: new Date().toISOString(),
            active: true,
            avgRating: 4.2,
            totalRatings: 12,
        }
    );
    const provider = (service.providerId && MOCK_PROVIDER && String(service.providerId) === String(MOCK_PROVIDER.providerId)) ? MOCK_PROVIDER : {
        providerId: service.providerId || 'unknown',
        providerName: 'Unknown Provider',
        profilePictureUrl: '',
        phone: null,
        email: null,
        addressLine1: '',
        city: '',
        state: ''
    };

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
        const arr = [...MOCK_REVIEWS];
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
    }, [reviewSort]);

    const dispatch = useDispatch();
    const items = useSelector((s) => s.cart.items || []);

    const handleAddToCart = () => {
        const exists = items.find((i) => i.providerId === service.providerId && i.serviceName === service.serviceName);
        if (exists) {
            toastMessage({ msg: `${service.serviceName} is already in cart`, type: 'info' });
            return;
        }

        const payload = {
            providerId: service.providerId,
            serviceName: service.serviceName,
            description: service.description,
            cost: service.cost,
            location: service.location,
            availability: service.availability,
            imageUrl: service.imageUrl,
            createdAt: service.createdAt,
            active: service.active,
            avgRating: service.avgRating,
            totalRatings: service.totalRatings,
        };

        dispatch(addItemAction(payload));
        toastMessage({ msg: `${service.serviceName} added to cart`, type: 'success' });
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, mt: { xs: 8, md: 12 }, maxWidth: 1200, mx: 'auto' }}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }} elevation={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <Box sx={{ position: 'relative', flex: '0 0 420px' }}>
                        <Box component="img" src={service.imageUrl} alt={service.serviceName} sx={{ width: '100%', height: { xs: 220, md: 380 }, objectFit: 'cover', display: 'block' }} />
                        <Box sx={{ position: 'absolute', left: 16, bottom: 16, bgcolor: 'rgba(0,0,0,0.5)', color: 'common.white', px: 2, py: 1, borderRadius: 1 }}>
                            <Typography variant="subtitle2">{service.serviceName}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Rating value={service.avgRating || 0} precision={0.1} readOnly size="small" sx={{ color: 'gold' }} />
                                <Typography variant="caption" sx={{ ml: 1 }}>{service.totalRatings} reviews</Typography>
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>{service.serviceName}</Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                                <Chip icon={<PlaceIcon />} label={service.location} variant="outlined" sx={{ borderRadius: 2 }} />
                                <Chip icon={<AccessTimeIcon />} label={service.availability} variant="outlined" sx={{ borderRadius: 2 }} />
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="body1" color="text.secondary">{service.description}</Typography>

                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>{formatINR(service.cost)}</Typography>
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
                                <Avatar src={provider.profilePictureUrl} alt={provider.providerName} />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{provider.providerName}</Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <Rating value={service.avgRating || 0} precision={0.1} readOnly size="small" />
                                <Typography variant="body2" color="text.secondary">{service.totalRatings} ratings</Typography>
                            </Stack>

                            <Divider sx={{ my: 1 }} />

                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{service.serviceName}</Typography>
                                <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatINR(service.cost)}</Typography>
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