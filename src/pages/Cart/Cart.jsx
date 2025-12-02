import React from 'react';
import {
    Box,
    Paper,
    Stack,
    Typography,
    Button,
    IconButton,
    Divider,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ShoppingBag as ShoppingBagIcon,
    ClearAll as ClearAllIcon,
    ShoppingCartRounded as ShoppingCartRoundedIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../../store/cartSlice';
import formatINR from '../../utils/formatCurrency';
import toastMessage from '../../utils/toastMessage';
import apiClient from '../../utils/apiClient';

const Cart = () => {

    const items = useSelector((s) => s.cart.items || []);
    const dispatch = useDispatch();
    
    // Debug: Check what's in the cart
    React.useEffect(() => {
        console.log('Cart Redux items:', items);
        items.forEach((item, index) => {
            console.log(`Cart item ${index}:`, {
                serviceId: item.serviceId,
                serviceName: item.serviceName,
                providerId: item.providerId,
                fullItem: item
            });
        });
    }, [items]);
    
    const subtotal = items.reduce((sum, it) => sum + (Number(it.cost) || 0), 0);
    const TAX_RATE = 0.18; // 18% GST
    const SERVICE_FEE = 50; // flat service fee
    const discount = 0; // placeholder for coupons
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + tax + SERVICE_FEE - discount).toFixed(2);

    const user = useSelector((s) => s.user?.profile || { name: '', email: '', phone: '' });
    const [checkoutOpen, setCheckoutOpen] = React.useState(false);
    const [clearCartOpen, setClearCartOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = async () => {
        if (!user.name || !user.phone) {
            return toastMessage({ msg: 'Please set your name and phone in your profile before proceeding', type: 'warning' });
        }
        
        if (!user.userId) {
            return toastMessage({ msg: 'Please log in to proceed with checkout', type: 'error' });
        }

        // Check if all items have provider ID
        const itemsWithoutProvider = items.filter(item => !item.providerId);
        if (itemsWithoutProvider.length > 0) {
            console.log('Items missing provider ID:', itemsWithoutProvider);
            return toastMessage({ 
                msg: `Some services are missing provider information. Please remove and re-add these services to your cart.`, 
                type: 'error' 
            });
        }

        setLoading(true);
        try {
            // Transform cart items to the specified payload format
            const orderPayload = items.map(item => ({
                userId: user.userId,
                providerId: item.providerId,
                serviceId: item.serviceId,
                requestedDate: new Date().toISOString(),
            }));

            console.log('Checkout payload:', orderPayload);

            const result = await apiClient.post('/api/v1/orders/checkout', orderPayload);
            
            setCheckoutOpen(false);
            dispatch(clearCart());
            toastMessage({ 
                msg: `Checkout successful! ${result.length} order(s) created successfully.`, 
                type: 'success' 
            });
        } catch (error) {
            console.error('Checkout error:', error);
            toastMessage({ 
                msg: error.message || 'Checkout failed. Please try again.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3, mt: 7 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Cart & Checkout</Typography>
                {items?.length > 0 && (
                    <Box sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.875rem'
                    }}>
                        {items.length}
                    </Box>
                )}
            </Stack>

            {items?.length === 0 ? (
                <Paper sx={{ p: { xs: 4, md: 8 }, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box component="img"
                            src="/empty-cart-illustration.png"
                            alt="Empty cart"
                            sx={{ width: { xs: 620, md: 620 }, maxWidth: '100%', height: 'auto', mb: 1 }}
                        />
                    </Box>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <ShoppingCartRoundedIcon sx={{ mr: 1 }} />
                        Your Cart Is Empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Looks like you haven't added any services yet. Discover professional services nearby and add them to your cart.
                    </Typography>
                </Paper>
            ) : (
                <>
                    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Selected Services</Typography>
                        <Stack spacing={2}>
                            {items.map((it) => (
                                <Paper
                                    key={`${it.providerId}-${it.serviceName}`}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: 1,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                                            <Avatar
                                                src={it.imageUrl}
                                                variant="rounded"
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    boxShadow: 1
                                                }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                                                    {it.serviceName}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        mb: 0.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {it.description}
                                                </Typography>
                                                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mt: 0.5 }}>
                                                    Provider ID: {it.providerId || 'Unknown'}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Stack
                                            direction={{ xs: 'row', sm: 'row' }}
                                            spacing={2}
                                            alignItems="center"
                                            sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
                                        >
                                            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: 'primary.main' }}>
                                                {formatINR(it.cost)}
                                            </Typography>
                                            <IconButton
                                                size="medium"
                                                onClick={() => {
                                                    dispatch(removeItem(it.serviceId));
                                                    toastMessage({ msg: 'Service removed from cart', type: 'info' });
                                                }}
                                                aria-label="remove"
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': {
                                                        bgcolor: 'error.light',
                                                        color: 'error.dark'
                                                    }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    </Paper>

                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                        elevation={2}
                    >
                        <Box sx={{ minWidth: 280, maxWidth: 420 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Summary</Typography>
                            <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                                    <Typography variant="body1">
                                        Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {formatINR(subtotal)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                                    <Typography variant="body1">
                                        GST ({Math.round(TAX_RATE * 100)}%)</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {formatINR(tax)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                                    <Typography variant="body1">Service fee</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatINR(SERVICE_FEE)}</Typography>
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        bgcolor: 'background.paper',
                                        boxShadow: 1
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{formatINR(total)}</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="column" spacing={2} sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} /> : <ShoppingBagIcon />}
                                    onClick={() => {
                                        const token = localStorage.getItem('token');
                                        if (!token || !user.userId) {
                                            toastMessage({ 
                                                msg: 'Please log in to proceed with checkout', 
                                                type: 'error' 
                                            });
                                            return;
                                        }
                                        setCheckoutOpen(true);
                                    }}
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        boxShadow: 3,
                                        '&:hover': {
                                            boxShadow: 6,
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<ClearAllIcon />}
                                    onClick={() => setClearCartOpen(true)}
                                    sx={{ 
                                        py: 1,
                                        borderColor: 'error.main',
                                        color: 'error.main',
                                        '&:hover': {
                                            borderColor: 'error.dark',
                                            bgcolor: 'error.main',
                                            color: 'white'
                                        }
                                    }}
                                >
                                    Clear Cart
                                </Button>
                            </Stack>
                        </Box>
                    </Paper>

                    <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Confirm Booking</DialogTitle>
                        <DialogContent>
                            <Stack spacing={1} sx={{ mb: 1 }} direction="row" alignItems="center">
                                <Avatar
                                    src={user.profilePictureUrl || undefined}
                                    sx={{ width: 40, height: 40, mr: 1 }}
                                >{!user.profilePictureUrl && (user.name || 'G')[0]}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontWeight: 700 }}>{user.name || 'Guest'}</Typography>
                                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                    <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {items.map((it) => (
                                <Stack
                                    key={`${it.providerId}-${it.serviceName}`}
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ py: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar src={it.imageUrl} variant="rounded" sx={{ width: 36, height: 28 }} />
                                        <Typography>{it.serviceName}</Typography>
                                    </Stack>
                                    <Typography sx={{ fontWeight: 700 }}>{formatINR(it.cost)}</Typography>
                                </Stack>
                            ))}

                            <Divider sx={{ my: 1 }} />
                            <Stack spacing={0.5}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Items subtotal
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(subtotal)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Discount
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(discount)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        GST ({Math.round(TAX_RATE * 100)}%)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(tax)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Service fee
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(SERVICE_FEE)}
                                    </Typography>
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle2">Total</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                        {formatINR(total)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCheckoutOpen(false)} disabled={loading}>Cancel</Button>
                            <Button 
                                variant="contained" 
                                onClick={handleConfirm}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} /> : null}
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Clear Cart Confirmation Dialog */}
                    <Dialog
                        open={clearCartOpen}
                        onClose={() => setClearCartOpen(false)}
                        maxWidth="xs"
                        fullWidth
                    >
                        <DialogTitle>Clear Cart?</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to remove all from your cart?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setClearCartOpen(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    dispatch(clearCart());
                                    setClearCartOpen(false);
                                    toastMessage({ msg: 'Cart cleared successfully', type: 'info' });
                                }}
                            >
                                Clear Cart
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default Cart;