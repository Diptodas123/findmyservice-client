import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Stack, Typography, Skeleton, Pagination, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { LocalOffer as LocalOfferIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, ShoppingCart as ShoppingCartIcon, CheckCircle as CheckCircleIcon, Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import { addItem, removeItem, clearCart } from '../../store/cartSlice';
import toastMessage from '../../utils/toastMessage';
import { useNavigate } from 'react-router-dom';

const ServicesList = ({ services = [], loading, truncate, pageSize: initialPageSize = 4, provider }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const [openDialog, setOpenDialog] = useState(false);
    const [pendingService, setPendingService] = useState(null);
    const pageSize = initialPageSize;

    const handleAddToCart = (service) => {
        // Check if already in cart
        const isInCart = cartItems.some(item => item.serviceId === service.id);
        if (isInCart) {
            toastMessage('info', 'This service is already in your cart');
            return;
        }

        // Check if cart has items from different provider
        if (cartItems.length > 0) {
            const currentProviderId = cartItems[0].providerId;
            if (currentProviderId !== provider?.providerId) {
                // Show dialog instead of toast
                setPendingService(service);
                setOpenDialog(true);
                return;
            }
        }

        dispatch(addItem({
            serviceId: service.id,
            serviceName: service.name,
            description: service.description,
            imageUrl: service.imageUrl,
            providerId: provider?.providerId,
            providerName: provider?.providerName,
            location: provider?.city,
            cost: service.price || 0,
        }));
        toastMessage('success', `${service.name} added to cart!`);
    };

    const handleEmptyCartAndAdd = () => {
        // Clear cart and add new service
        dispatch(clearCart());
        if (pendingService && provider) {
            dispatch(addItem({
                serviceId: pendingService.id,
                serviceName: pendingService.name,
                description: pendingService.description,
                imageUrl: pendingService.imageUrl,
                providerId: provider.providerId,
                providerName: provider.providerName,
                location: provider.city,
                cost: pendingService.price || 0,
            }));
            toastMessage('success', `Cart cleared. ${pendingService.name} added to cart!`);
        }
        setOpenDialog(false);
        setPendingService(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPendingService(null);
    };

    const handleRemoveFromCart = (serviceId) => {
        dispatch(removeItem((item) => item.serviceId === serviceId));
        toastMessage('success', 'Service removed from cart');
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
                <Paper key={svc.id}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        alignItems: 'flex-start',
                        transition: 'transform 150ms, box-shadow 150ms',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3, cursor: 'pointer' }
                    }}
                    onClick={() => {
                        navigate(`/service-details/${svc.id}`);
                    }}
                >
                    <Box
                        component="img"
                        src={svc.imageUrl}
                        alt={svc.name}
                        sx={{
                            width: 96, height: 72, objectFit: 'cover', borderRadius: 1
                        }} />
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocalOfferIcon color="primary" />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{svc.name}</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {truncate(svc.description, 140)}
                                </Typography>
                            </Stack>
                            {cartItems.some(item => item.serviceId === svc.id) ? (
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
                                        onClick={() => handleRemoveFromCart(svc.id)}
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
                                    onClick={() => handleAddToCart(svc)}
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

            {/* Provider Conflict Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Different Service Provider
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can only order services from one provider at a time.
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 2, fontWeight: 600 }}>
                        Current cart: {cartItems.length > 0 && cartItems[0].providerName}
                    </DialogContentText>
                    <DialogContentText sx={{ mt: 1 }}>
                        To add this service from <strong>{provider?.providerName}</strong>,
                        you need to empty your current cart first.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        onClick={handleCloseDialog}
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEmptyCartAndAdd}
                        variant="contained"
                        color="error"
                        startIcon={<ShoppingCartIcon />}
                    >
                        Empty Cart & Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default ServicesList;
