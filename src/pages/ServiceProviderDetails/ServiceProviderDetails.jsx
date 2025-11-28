import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    Skeleton,
    Dialog,
    IconButton,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Close as CloseIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    InfoOutlined as InfoOutlinedIcon,
    PhotoLibraryOutlined as PhotoLibraryOutlinedIcon,
    BuildOutlined as BuildOutlinedIcon,
    RateReviewOutlined as RateReviewOutlinedIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';

import toastMessage from '../../utils/toastMessage';
import { MOCK_PROVIDER, MOCK_REVIEWS } from '../../../mockData';

import HeaderBlock from './HeaderBlock';
import PhotosGrid from './PhotosGrid';
import ServicesList from './ServicesList';
import ReviewsList from './ReviewsList';
import ContactCard from './ContactCard';

const ServiceProviderDetails = () => {
    const provider = MOCK_PROVIDER;

    const [expandedReviewIds, setExpandedReviewIds] = useState([]);

    const overviewRef = useRef(null);
    const photosRef = useRef(null);
    const servicesRef = useRef(null);
    const reviewsRef = useRef(null);

    const scrollTo = (ref) => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSection, setSelectedSection] = useState('overview');
    const [reviewSort, setReviewSort] = useState('newest');

    const truncate = (text, max = 120) => (text.length > max ? `${text.slice(0, max).trim()}…` : text);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => setLightboxOpen(false);

    const nextImage = useCallback(() => setCurrentIndex((i) => (i + 1) % provider.imageUrls.length), [provider.imageUrls.length]);
    const prevImage = useCallback(() => setCurrentIndex((i) => (i - 1 + provider.imageUrls.length) % provider.imageUrls.length), [provider.imageUrls.length]);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, nextImage, prevImage]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(t);
    }, []);

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

    if (!provider) return null;

    const handleCall = () => {
        if (provider.phone) {
            window.location.href = `tel:${provider.phone}`;
        } else {
            toastMessage({ msg: 'Phone number not available', type: 'info' });
        }
    };

    const handleEmail = () => {
        if (provider.email) {
            window.location.href = `mailto:${provider.email}`;
        } else {
            toastMessage({ msg: 'Email not available', type: 'info' });
        }
    };

    const onShare = () => async () => {
        try {
            if (navigator.share)
                await navigator.share({
                    title: provider.providerName,
                    text: provider.description,
                    url: window.location.href
                });
            else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href); toastMessage({
                    msg: 'Link copied to clipboard',
                    type: 'success'
                });
            }
            else toastMessage({
                msg: 'Share not supported',
                type: 'info'
            });
        } catch {
            toastMessage({
                msg: 'Unable to share',
                type: 'error'
            });
        }
    }
    return (
        <>
            <Box sx={{ p: { xs: 1, md: 4 }, mt: 10, maxWidth: 1200, mx: 'auto' }}>
                <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
                    {loading ? (
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2} alignItems="center"
                            justifyContent="space-between"
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Skeleton variant="rectangular" width={128} height={128} sx={{ borderRadius: 1 }} />
                                <Box>
                                    <Skeleton variant="text" width={220} height={28} />
                                    <Skeleton variant="text" width={160} height={20} />
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <Skeleton variant="rectangular" width={120} height={28} />
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <HeaderBlock
                                provider={provider}
                                loading={loading}
                                openLightbox={openLightbox}
                                onShare={onShare()}
                            />
                        </Stack>
                    )}
                </Paper>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    <Box sx={{ width: { xs: '100%', md: '80%' } }}>
                        {/* Horizontal menu above main content */}
                        <Box sx={{ mb: 2 }}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    p: 1,
                                    overflowX: 'auto',
                                    position: { xs: 'static', md: 'sticky' },
                                    top: { md: 88 },
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    alignItems: 'center',
                                }}
                                elevation={1}
                            >
                                <Button
                                    startIcon={<InfoOutlinedIcon />}
                                    onClick={() => { setSelectedSection('overview'); scrollTo(overviewRef); }}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 2,
                                        borderBottom: selectedSection === 'overview' ? '2px solid' : '2px solid transparent',
                                        borderColor: selectedSection === 'overview' ? 'primary.main' : 'transparent',
                                        transition: 'border-color 200ms'
                                    }}
                                >
                                    Overview
                                </Button>

                                <Button
                                    startIcon={<PhotoLibraryOutlinedIcon />}
                                    onClick={() => { setSelectedSection('photos'); scrollTo(photosRef); }}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 2,
                                        borderBottom: selectedSection === 'photos' ? '2px solid' : '2px solid transparent',
                                        borderColor: selectedSection === 'photos' ? 'primary.main' : 'transparent',
                                        transition: 'border-color 200ms'
                                    }}
                                >
                                    Photos
                                </Button>

                                <Button
                                    startIcon={<BuildOutlinedIcon />}
                                    onClick={() => { setSelectedSection('services'); scrollTo(servicesRef); }}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 2,
                                        borderBottom: selectedSection === 'services' ? '2px solid' : '2px solid transparent',
                                        borderColor: selectedSection === 'services' ? 'primary.main' : 'transparent',
                                        transition: 'border-color 200ms'
                                    }}
                                >
                                    Services
                                </Button>

                                <Button
                                    startIcon={<RateReviewOutlinedIcon />}
                                    onClick={() => { setSelectedSection('reviews'); scrollTo(reviewsRef); }}
                                    size="small"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 2,
                                        borderBottom: selectedSection === 'reviews' ? '2px solid' : '2px solid transparent',
                                        borderColor: selectedSection === 'reviews' ? 'primary.main' : 'transparent',
                                        transition: 'border-color 200ms'
                                    }}
                                >
                                    Reviews
                                </Button>
                            </Paper>
                        </Box>

                        {/* Sections column */}
                        <Box sx={{ flex: 1 }}>
                            <Box ref={overviewRef} id="overview" sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, alignItems: 'center', display: 'flex' }}>
                                    <InfoOutlinedIcon sx={{ mr: 1 }} /> Overview
                                </Typography>
                                <Typography variant="body1" color="text.secondary">{provider.description}</Typography>
                            </Box>

                            <Box ref={photosRef} id="photos" sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, alignItems: 'center', display: 'flex' }}>
                                    <PhotoLibraryOutlinedIcon sx={{ mr: 1 }} /> Photos
                                </Typography>
                                <PhotosGrid
                                    imageUrls={provider.imageUrls}
                                    providerName={provider.providerName}
                                    loading={loading}
                                    onOpen={openLightbox}
                                />
                            </Box>

                            <Box ref={servicesRef} id="services" sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, alignItems: 'center', display: 'flex' }}>
                                    <BuildOutlinedIcon sx={{ mr: 1 }} /> Services
                                </Typography>
                                <ServicesList services={provider.services} loading={loading} truncate={truncate} />
                            </Box>

                            <Box ref={reviewsRef} id="reviews" sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, alignItems: 'center', display: 'flex' }}>
                                    <RateReviewOutlinedIcon sx={{ mr: 1 }} /> Reviews
                                </Typography>
                                {loading ? (
                                    <>
                                        <Skeleton variant="text" width="60%" />
                                        <Skeleton variant="rectangular" height={80} sx={{ mt: 1 }} />
                                    </>
                                ) : (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                            <FormControl size="small" sx={{ minWidth: 160 }}>
                                                <InputLabel id="review-sort-label">Sort</InputLabel>
                                                <Select
                                                    labelId="review-sort-label"
                                                    value={reviewSort}
                                                    label="Sort"
                                                    onChange={(e) => setReviewSort(e.target.value)}
                                                >
                                                    <MenuItem value="newest">Newest</MenuItem>
                                                    <MenuItem value="oldest">Oldest</MenuItem>
                                                    <MenuItem value="highest">Highest Rating</MenuItem>
                                                    <MenuItem value="lowest">Lowest Rating</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <ReviewsList
                                            reviews={sortedReviews}
                                            expandedReviewIds={expandedReviewIds}
                                            toggleExpand={(id) => setExpandedReviewIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                                        />
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '40%' }, alignSelf: 'flex-start' }}>
                        <Box sx={{ position: 'sticky', top: 88 }}>
                            <ContactCard provider={provider} loading={loading} onCall={handleCall} onEmail={handleEmail} />
                            <Paper sx={{ p: 2, mt: 2 }} elevation={0}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> Location
                                </Typography>
                                <Box sx={{
                                    mt: 2,
                                    width: '100%',
                                    height: 0,
                                    paddingBottom: '56%',
                                    position: 'relative',
                                    borderRadius: 1,
                                    overflow: 'hidden'
                                }}>
                                    <iframe
                                        title="provider-map"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(`${provider.addressLine1} ${provider.city} ${provider.state}`)}&output=embed`}
                                        style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Dialog open={lightboxOpen} onClose={closeLightbox} maxWidth="lg">
                <Box sx={{ position: 'relative', bgcolor: 'background.paper', p: 1 }}>
                    <IconButton
                        onClick={closeLightbox}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'common.white',
                            zIndex: 10,
                            bgcolor: 'rgba(0,0,0,0.4)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                        }}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton
                        onClick={prevImage}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'common.white',
                            zIndex: 10,
                            bgcolor: 'rgba(0,0,0,0.3)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                        }}>
                        <ChevronLeftIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={nextImage}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'common.white',
                            zIndex: 10,
                            bgcolor: 'rgba(0,0,0,0.3)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' }
                        }}>
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                    <Box component="img"
                        src={provider.imageUrls[currentIndex]}
                        alt={`lightbox-${currentIndex}`}
                        sx={{
                            width: '100%',
                            height: { xs: '60vh', md: '70vh' },
                            objectFit: 'contain',
                            bgcolor: 'black'
                        }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto', justifyContent: 'center', px: 1 }}>
                        {provider.imageUrls.map((src, idx) => (
                            <Box
                                key={`thumb-${idx}`}
                                onClick={() => setCurrentIndex(idx)}
                                sx={{
                                    border: idx === currentIndex ? '2px solid' : '2px solid transparent',
                                    borderColor: idx === currentIndex ? 'primary.main' : 'transparent',
                                    borderRadius: 1,
                                    cursor: 'pointer'
                                }}>
                                <Box component="img"
                                    src={src}
                                    alt={`thumb-${idx}`}
                                    sx={{
                                        width: { xs: 80, md: 100 },
                                        height: { xs: 56, md: 70 },
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
                        {provider.imageUrls.map((_, idx) => (
                            <Box key={`dot-${idx}`}
                                onClick={() => setCurrentIndex(idx)}
                                sx={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    bgcolor: idx === currentIndex ? 'primary.main' : 'grey.400',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default ServiceProviderDetails;