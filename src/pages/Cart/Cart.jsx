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
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();

    const items = useSelector((s) => s.cart.items || []);
    const dispatch = useDispatch();
    const subtotal = items.reduce((sum, it) => sum + (Number(it.cost) || 0), 0);
    const TAX_RATE = 0.18; // 18% GST
    const SERVICE_FEE = 50; // flat service fee
    const discount = 0; // placeholder for coupons
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const total = +(subtotal + tax + SERVICE_FEE - discount).toFixed(2);

    const user = useSelector((s) => s.user?.profile || { name: '', email: '', phone: '' });
    const [checkoutOpen, setCheckoutOpen] = React.useState(false);

    const handleConfirm = () => {
        if (!user.name || !user.phone) {
            return toastMessage({ msg: 'Please set your name and phone in your profile before proceeding', type: 'warning' });
        }
        setCheckoutOpen(false);
        dispatch(clearCart());
        toastMessage({ msg: 'Checkout successful — booking created', type: 'success' });
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Cart & Checkout</Typography>

            <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.profilePictureUrl || ''}
                            sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 20 }}>
                            {!user?.profilePictureUrl && (user?.name || 'G')[0]}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 800 }}>{user.name || 'Guest User'}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Button onClick={() => navigate('/profile')}
                            startIcon={<EditIcon />}
                            variant="outlined">
                            Edit Profile
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

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
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Stack spacing={2}>
                            {items.map((it) => (
                                <Stack key={`${it.providerId}-${it.serviceName}`} direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                                        <Avatar src={it.imageUrl} variant="rounded" sx={{ width: 72, height: 56 }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 700 }}>{it.serviceName}</Typography>
                                            <Typography variant="body2" color="text.secondary">{it.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">Provider: {it.providerId}</Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontWeight: 800 }}>{formatINR(it.cost)}</Typography>
                                        <IconButton size="small" color="primary" onClick={() => {/* TODO: qty control */ }} aria-label="increase">
                                            <ShoppingBagIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => dispatch(removeItem({ providerId: it.providerId, serviceName: it.serviceName }))} aria-label="remove">
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }} elevation={1}>
                        <Box sx={{ minWidth: 260 }}>
                            <Typography variant="subtitle2" color="text.secondary">Invoice</Typography>
                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Items subtotal
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(subtotal)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Discount</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(discount)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        GST ({Math.round(TAX_RATE * 100)}%)</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatINR(tax)}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">Service fee</Typography>
                                    <Typography variant="body2" color="text.secondary">{formatINR(SERVICE_FEE)}</Typography>
                                </Stack>
                                <Divider sx={{ my: 1 }} />
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2">Total</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{formatINR(total)}</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button variant="outlined" color="error" startIcon={<ClearAllIcon />} onClick={() => dispatch(clearCart())}>Clear Cart</Button>
                            <Button variant="contained" startIcon={<ShoppingBagIcon />} onClick={() => setCheckoutOpen(true)}>Checkout</Button>
                        </Stack>
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
                            <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleConfirm}>Confirm Booking</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default Cart;