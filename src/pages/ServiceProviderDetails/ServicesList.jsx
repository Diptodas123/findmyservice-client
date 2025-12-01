import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Stack, Typography, Skeleton, Pagination, IconButton, Button } from '@mui/material';
import { LocalOffer as LocalOfferIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ShoppingCart as ShoppingCartIcon, CheckCircle as CheckCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { addItem, removeItem, clearCart } from '../../store/cartSlice';
import toastMessage from '../../utils/toastMessage';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../theme/useThemeMode';

const ServicesList = ({ services = [], loading, truncate, pageSize: initialPageSize = 4, provider }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const { mode } = useThemeMode();
    const pageSize = initialPageSize;

    const isInCart = (serviceId) => cartItems.some(item => item.serviceId === serviceId);

    const handleAddToCart = (service) => {
        if (isInCart(service.serviceId)) {
            toastMessage('info', `${service.serviceName} is already in cart`);
            return;
        }

        const cartItem = {
            serviceId: service.serviceId,
            serviceName: service.serviceName,
            description: service.description,
            imageUrl: service.imageUrl,
            providerId: provider?.providerId || provider?.id,
            providerName: provider?.providerName || provider?.name,
            location: service.location || provider?.city,
            cost: service.cost || 0,
        };
        
        console.log('ServicesList - Adding to cart:', cartItem);
        dispatch(addItem(cartItem));
        toastMessage('success', `${service.serviceName} added to cart!`);
    };

    const handleRemoveFromCart = (serviceId) => {
        dispatch(removeItem(serviceId));
        toastMessage('success', 'Service removed from cart!');
    };

    if (loading) {
        return (
            <Stack spacing={2}>
                {[1, 2, 3].map((n) => (
                    <Paper key={`skele-${n}`} sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>
                        <Skeleton variant="rectangular" width={96} height={72} sx={{ borderRadius: 1 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                        </Box>
                    </Paper>
                ))}
            </Stack>
        );
    }

    const total = services ? services.length : 0;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const effectivePage = Math.min(Math.max(1, page), pageCount);
    const visible = services ? services.slice((effectivePage - 1) * pageSize, effectivePage * pageSize) : [];

    return (
        <Stack spacing={2}>
            {visible.map((svc) => (
                <Paper key={svc.serviceId}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        alignItems: 'flex-start',
                        transition: 'transform 150ms, box-shadow 150ms',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, cursor: 'pointer' }
                    }}
                    onClick={() => {
                        navigate(`/service-details/${svc.serviceId}`);
                    }}
                >
                    <Box
                        component="img"
                        src={svc.imageUrl}
                        alt={svc.serviceName}
                        sx={{
                            width: 96, height: 72, objectFit: 'cover', borderRadius: 1
                        }} />
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocalOfferIcon color="primary" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{svc.serviceName}</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {truncate(svc.description, 140)}
                                </Typography>
                            </Stack>
                            {cartItems.some(item => item.serviceId === svc.serviceId) ? (
                                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, ml: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        startIcon={<CheckCircleIcon />}
                                        sx={{
                                            minWidth: 120,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        Added to Cart
                                    </Button>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFromCart(svc.serviceId);
                                        }}
                                        sx={{
                                            border: '1px solid',
                                            borderColor: 'error.main',
                                            '&:hover': {
                                                backgroundColor: 'error.main',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<ShoppingCartIcon />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(svc);
                                    }}
                                    sx={{ minWidth: 120, flexShrink: 0, ml: 2 }}
                                >
                                    Add to Cart
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Paper>
            ))}

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 1 }}>
                    <IconButton
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="previous page"
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.primary',
                            boxShadow: 1,
                            '&:hover': { bgcolor: (theme) => theme.palette.action.hover },
                            width: 36,
                            height: 36,
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    <Pagination
                        count={pageCount}
                        page={effectivePage}
                        onChange={(_, v) => setPage(v)}
                        color="primary"
                        size="small"
                    />

                    <IconButton
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        aria-label="next page"
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.primary',
                            boxShadow: 1,
                            '&:hover': { bgcolor: (theme) => theme.palette.action.hover },
                            width: 36,
                            height: 36,
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            )}
        </Stack>
    );
};

export default ServicesList;
