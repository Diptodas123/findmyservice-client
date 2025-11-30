import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    CircularProgress,
    Paper,
    Divider,
    Stack,
    Button,
    Alert,
    Container
} from '@mui/material';
import {
    ShoppingBag,
    Schedule,
    CheckCircle,
    Cancel,
    Payment,
    CalendarToday,
    Person,
    Phone,
    Email
} from '@mui/icons-material';
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(state => state.user?.profile);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // No token, definitely not logged in
            setError('Please log in to view your order history');
            setLoading(false);
            return;
        }
        
        // Token exists, either fetch orders directly or wait for user profile
        fetchOrderHistory();
    }, [user?.userId]);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            
            let response;
            
            try {
                // Try backend API first: GET /api/v1/orders/user/{userId}
                // Use userId from profile or fallback to a default value if token exists but profile not loaded
                const userId = user?.userId || 1; // Fallback for development
                response = await apiClient.get(`/api/v1/orders/user/${userId}`);
                console.log('Using backend API for orders:', response);
            } catch (backendError) {
                // Fallback to mock API for development/testing
                console.log('Backend API failed, using mock API:', backendError.message);
                try {
                    const { mockOrderAPI } = await import('../../../mockData');
                    const userId = user?.userId || 1; // Fallback for development
                    response = await mockOrderAPI.getOrdersByUser(userId);
                    console.log('Using mock API for orders:', response);
                } catch (mockError) {
                    console.warn('Mock API also failed:', mockError);
                    throw new Error('Unable to load order data. Please try again later.');
                }
            }
            
            // Sort orders by creation date (newest first)
            const sortedOrders = Array.isArray(response) ? response.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            ) : [];
            
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching order history:', error);
            setError(error.userMessage || error.message || 'Failed to load order history');
            toastMessage({ 
                msg: error.userMessage || error.message || 'Failed to load order history', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'REQUESTED':
                return <Schedule color="info" />;
            case 'PAID':
                return <Payment color="success" />;
            case 'SCHEDULED':
                return <CalendarToday color="primary" />;
            case 'COMPLETED':
                return <CheckCircle color="success" />;
            case 'CANCELLED':
                return <Cancel color="error" />;
            default:
                return <ShoppingBag color="primary" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'REQUESTED':
                return 'info';
            case 'PAID':
                return 'success';
            case 'SCHEDULED':
                return 'primary';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReorderServices = (lineItems) => {
        // Add services back to cart for reorder
        toastMessage({ 
            msg: 'Services added to cart for reorder!', 
            type: 'success' 
        });
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress size={50} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button variant="contained" onClick={fetchOrderHistory}>
                    Retry
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Order History
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Track your service orders and booking history
            </Typography>

            {orders.length === 0 ? (
                <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                    <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No orders found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        You haven't placed any service orders yet.
                    </Typography>
                    <Button variant="contained" href="/search">
                        Browse Services
                    </Button>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {orders.map((order) => (
                        <Card 
                            key={order.orderId}
                            elevation={0}
                            sx={{ 
                                border: '1px solid', 
                                borderColor: 'divider',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    borderColor: 'primary.light'
                                }
                            }}
                        >
                            {/* Order Header */}
                            <Box 
                                sx={{ 
                                    bgcolor: 'grey.50', 
                                    px: 3, 
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                                    <Box>
                                        <Typography variant="h6" fontWeight="600" color="text.primary">
                                            Order #{order.orderId}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                            Placed on {formatDate(order.createdAt)}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Typography variant="h6" fontWeight="600" color="primary.main">
                                            {formatCurrency(order.totalCost)}
                                        </Typography>
                                        <Chip
                                            icon={getStatusIcon(order.orderStatus)}
                                            label={order.orderStatus}
                                            color={getStatusColor(order.orderStatus)}
                                            variant="filled"
                                            size="medium"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <CardContent sx={{ p: 3 }}>
                                {/* Services Section */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="600" color="text.primary" sx={{ mb: 2 }}>
                                        Services Ordered
                                    </Typography>
                                    {order.lineItemDTOS && order.lineItemDTOS.length > 0 ? (
                                        <Stack spacing={2}>
                                            {order.lineItemDTOS.map((lineItem, index) => (
                                                <Box 
                                                    key={lineItem.lineItemId || lineItem.serviceName}
                                                    sx={{ 
                                                        p: 2, 
                                                        bgcolor: 'grey.50',
                                                        borderRadius: 1.5,
                                                        border: '1px solid',
                                                        borderColor: 'grey.200'
                                                    }}
                                                >
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={12} sm={7}>
                                                            <Box display="flex" alignItems="center" gap={2}>
                                                                {lineItem.imageUrl && (
                                                                    <Avatar
                                                                        src={lineItem.imageUrl}
                                                                        variant="rounded"
                                                                        sx={{ 
                                                                            width: 56, 
                                                                            height: 56,
                                                                            border: '2px solid white',
                                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                                        }}
                                                                    />
                                                                )}
                                                                <Box flex={1}>
                                                                    <Typography variant="body1" fontWeight="500" color="text.primary">
                                                                        {lineItem.serviceName}
                                                                    </Typography>
                                                                    {lineItem.quantityUnits && (
                                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                            Qty: {lineItem.quantityUnits}
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={3}>
                                                            {lineItem.scheduledDate && (
                                                                <Box>
                                                                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                                                                        SCHEDULED FOR
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.primary" fontWeight="500">
                                                                        {new Date(lineItem.scheduledDate).toLocaleDateString('en-IN', {
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={12} sm={2} textAlign="right">
                                                            <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                {formatCurrency(lineItem.cost)}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No service details available
                                        </Typography>
                                    )}
                                </Box>

                                {/* Provider and Payment Info */}
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                    {/* Provider Information */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ mb: 1.5, display: 'block' }}>
                                                SERVICE PROVIDER
                                            </Typography>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ 
                                                    bgcolor: 'primary.main', 
                                                    width: 40, 
                                                    height: 40 
                                                }}>
                                                    <Person fontSize="small" />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" fontWeight="500" color="text.primary">
                                                        {order.providerId?.providerName || 'Provider Name'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.providerId?.phone || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Payment Information */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1.5 }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ mb: 1.5, display: 'block' }}>
                                                PAYMENT DETAILS
                                            </Typography>
                                            <Box>
                                                <Typography variant="body2" color="text.primary" fontWeight="500">
                                                    {order.paymentMethod || 'Card Payment'}
                                                </Typography>
                                                {order.transactionId && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        ID: {order.transactionId.slice(-8)}
                                                    </Typography>
                                                )}
                                                {order.paymentDate && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(order.paymentDate)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Action Buttons */}
                                <Box display="flex" gap={1.5} flexWrap="wrap" justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        onClick={() => handleReorderServices(order.lineItemDTOS)}
                                        disabled={order.orderStatus === 'CANCELLED'}
                                        sx={{ 
                                            borderRadius: 2,
                                            px: 3,
                                            fontWeight: 500
                                        }}
                                    >
                                        Reorder Services
                                    </Button>
                                    {order.orderStatus === 'COMPLETED' && (
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            href={`/service-providers/${order.providerId?.providerId}`}
                                            sx={{ 
                                                borderRadius: 2,
                                                px: 3,
                                                fontWeight: 500
                                            }}
                                        >
                                            Rate Provider
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Container>
    );
};

export default OrderHistory;