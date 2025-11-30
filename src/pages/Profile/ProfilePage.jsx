import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileSidebar from './ProfileSidebar.jsx';
import { toast } from 'react-toastify';
import { addItem, clearCart } from '../../store/cartSlice';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  PhotoCamera, 
  Delete, 
  ShoppingBag,
  Schedule,
  CheckCircle,
  Cancel,
  Payment,
  CalendarToday,
  Person,
  Visibility,
  VisibilityOff,
  Warning as WarningIcon
} from '@mui/icons-material';
import cloudinary from '../../utils/cloudinary';
import toastMessage from '../../utils/toastMessage';
import apiClient from '../../utils/apiClient';
import { setUser } from '../../store/userSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const reduxProfile = useSelector((s) => s.user?.profile || {});
  const cartItems = useSelector((s) => s.cart?.items || []);
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState('personal');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Dialog state for reorder conflicts
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictOrder, setConflictOrder] = useState(null);
  const [currentCartProvider, setCurrentCartProvider] = useState('');
  
  // Popup dialog state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // 'success', 'error', 'warning'
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [formData, setFormData] = useState({
    name: reduxProfile?.name || '',
    email: reduxProfile?.email || '',
    phone: reduxProfile?.phone || '',
    addressLine1: reduxProfile?.addressLine1 || '',
    addressLine2: reduxProfile?.addressLine2 || '',
    city: reduxProfile?.city || '',
    state: reduxProfile?.state || '',
    zipCode: reduxProfile?.zipCode || '',
    username: reduxProfile?.username || '',
    profilePictureUrl: reduxProfile?.profilePictureUrl || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: reduxProfile?.name || '',
      email: reduxProfile?.email || '',
      phone: reduxProfile?.phone || '',
      addressLine1: reduxProfile?.addressLine1 || '',
      addressLine2: reduxProfile?.addressLine2 || '',
      city: reduxProfile?.city || '',
      state: reduxProfile?.state || '',
      zipCode: reduxProfile?.zipCode || '',
      username: reduxProfile?.username || '',
      profilePictureUrl: reduxProfile?.profilePictureUrl || '',
    }));
  }, [reduxProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB!');
      return;
    }
    setProfilePicture(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profilePictureUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setPopupMessage('');
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData(prev => ({ ...prev, profilePictureUrl: '' }));
  };

  const fetchOrderHistory = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);
      
      let response;
      
      try {
        // Try backend API first: GET /api/v1/orders/user/{userId}
        const userId = reduxProfile?.userId || 1; // Fallback for development
        response = await apiClient.get(`/api/v1/orders/user/${userId}`);
        console.log('Using backend API for orders:', response);
      } catch (backendError) {
        // Fallback to mock API for development/testing
        console.log('Backend API failed, using mock API:', backendError.message);
        try {
          const { mockOrderAPI } = await import('../../../mockData');
          const userId = reduxProfile?.userId || 1; // Fallback for development
          response = await mockOrderAPI.getOrdersByUser(userId);
          console.log('Using mock API for orders:', response);
        } catch (mockError) {
          console.warn('Mock API also failed:', mockError);
          throw new Error('Unable to load order data. Please try again later.');
        }
      }
      
      // Sort orders by creation date (newest first)
      const sortedOrders = Array.isArray(response) 
        ? [...response].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setOrdersError(error.userMessage || error.message || 'Failed to load order history');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && reduxProfile?.userId) {
      fetchOrderHistory();
    }
  }, [activeTab, reduxProfile?.userId]);

  useEffect(() => {
    if (activeTab === 'orders' && reduxProfile?.userId) {
      fetchOrderHistory();
    }
  }, [activeTab, reduxProfile?.userId]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
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

    const handleReorderServices = (order) => {
    const lineItems = order.lineItemDTOS;
    const orderProvider = order.providerId;
    
    if (!lineItems || lineItems.length === 0) {
      showPopup('No services to reorder', 'error');
      return;
    }

    // Check for provider conflicts
    if (cartItems.length > 0) {
      const currentCartProviderName = cartItems[0].providerName || cartItems[0].providerId;
      const orderProviderName = orderProvider?.providerName || orderProvider?.providerId;
      
      if (currentCartProviderName && orderProviderName && currentCartProviderName !== orderProviderName) {
        // Show Material-UI Dialog for provider conflict
        setCurrentCartProvider(currentCartProviderName);
        setConflictOrder(order);
        setConflictDialogOpen(true);
        return;
      }
    }

    // Proceed with reorder if no conflicts
    executeReorder(order);
  };

  const executeReorder = (order) => {
    const lineItems = order.lineItemDTOS;
    const orderProvider = order.providerId;

    try {
      // Clear current cart (either due to conflict or to start fresh)
      dispatch(clearCart());
      
      // Add each service from the order to cart
      for (const lineItem of lineItems) {
        // Transform lineItem to cart item format
        const cartItem = {
          serviceId: lineItem.lineItemId, // Use lineItemId as serviceId
          serviceName: lineItem.serviceName,
          cost: lineItem.cost,
          imageUrl: lineItem.imageUrl,
          providerId: orderProvider?.providerId || null,
          providerName: orderProvider?.providerName || 'Unknown Provider',
          location: null,
          availability: 'Available',
          description: `Reordered: ${lineItem.serviceName}`,
          avgRating: 4.5, // Default rating for reordered items
          quantityUnits: lineItem.quantityUnits || 1
        };
        
        dispatch(addItem(cartItem));
      }

      const serviceCount = lineItems.length;
      const providerName = orderProvider?.providerName || 'provider';
      
      showPopup(
        `${serviceCount} service${serviceCount > 1 ? 's' : ''} from ${providerName} added to cart!`,
        'success'
      );
      
    } catch (error) {
      console.error('Error reordering services:', error);
      showPopup('Failed to add services to cart. Please try again.', 'error');
    }
  };

  const handleConfirmReorder = () => {
    setConflictDialogOpen(false);
    executeReorder(conflictOrder);
  };

  const handleCancelReorder = () => {
    setConflictDialogOpen(false);
    setConflictOrder(null);
    setCurrentCartProvider('');
  };

  const validatePasswordStrength = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!formData.name || !formData.name.trim()) errors.name = 'Name is required';
    if (formData.email && !validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (formData.phone && !validatePhone(formData.phone)) errors.phone = 'Please enter a valid phone number';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    const payload = { ...formData };
    let prev = { ...reduxProfile };

    try {
      if (payload.profilePictureUrl && payload.profilePictureUrl.startsWith && payload.profilePictureUrl.startsWith('data:')) {
        showPopup('Uploading image...', 'warning');
        const blob = await (await fetch(payload.profilePictureUrl)).blob();
        const file = new File([blob], 'profile.png', { type: blob.type });
        const up = await cloudinary.uploadImage(file, { folder: 'findmyservice' });
        if (up?.secure_url) payload.profilePictureUrl = up.secure_url;
      }

      const optimistic = { ...prev, ...payload };
      dispatch(setUser(optimistic));

      const res = await apiClient.patch(`/api/v1/users/${reduxProfile.userId}`, payload);

      if (res && (res.profile || res.user)) {
        const updated = res.profile || res.user;
        dispatch(setUser(updated));
      } else {
        try {
          const latest = await apiClient.get(`/api/v1/users/${reduxProfile.userId}`);
          if (latest) dispatch(setUser(latest));
        } catch (fetchErr) {
          console.warn('Could not fetch latest after update, keeping optimistic state', fetchErr);
        }
      }

      showPopup('Profile updated successfully!', 'success');
    } catch (err) {
      dispatch(setUser(prev || {}));
      if (err?.response && err.response.errors) setFieldErrors(err.response.errors);
      if (!err?.isNetworkError) showPopup(err.userMessage || err.message || 'Failed to update profile', 'error');
      console.error('Profile update failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};

    if (!formData.currentPassword || !formData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword || !formData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (!validatePasswordStrength(formData.newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters and include a letter, number, and special character';
    } else if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    const prev = { ...reduxProfile };

    try {
      const payload = {
        currentPassword: formData.currentPassword,
        password: formData.newPassword,
      };

      const res = await apiClient.patch(`/api/v1/users/${reduxProfile.userId}`, payload);

      if (res && (res.profile || res.user)) {
        const updated = res.profile || res.user;
        dispatch(setUser(updated));
      }

      toastMessage({ msg: 'Password changed successfully!', type: 'success' });
      
      // Clear password fields
      setFormData(prev => ({ 
        ...prev, 
        currentPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
      }));

      // Reset password visibility
      setShowPassword({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });

    } catch (err) {
      dispatch(setUser(prev || {}));
      if (err?.response && err.response.errors) {
        setFieldErrors(err.response.errors);
      }
      
      const errorMsg = err?.userMessage || err?.message || 'Failed to change password';
      
      if (!err?.isNetworkError) {
        toastMessage({ msg: errorMsg, type: 'error' });
      }
      
      console.error('Password change failed', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>
        Personal Information
      </Typography>

      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.default' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar src={formData?.profilePictureUrl} sx={{ width: 150, height: 150 }}>
              {!formData?.profilePictureUrl && 'No Image'}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button variant="contained" color="primary" component="label" startIcon={<PhotoCamera />} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark } } : {}) })}>
                {profilePicture ? 'Change Photo' : 'Upload Photo'}
                <input type="file" hidden accept="image/*" onChange={handleProfilePictureChange} />
              </Button>
              {formData?.profilePicturePreview && (
                <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleRemoveProfilePicture} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark } } : {}) })}>
                  Remove
                </Button>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Recommended: Square image, at least 400x400px</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Max file size: 5MB</Typography>
            <Typography variant="body2" color="text.secondary">Supported formats: JPG, PNG, GIF</Typography>
          </Box>
        </Stack>
      </Paper>

      <Stack spacing={3} sx={{ maxWidth: { xs: '100%', md: '600px' } }}>
        <TextField fullWidth label="Name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Enter your name" error={!!fieldErrors.name} helperText={fieldErrors.name || ''} />
        <TextField fullWidth label="Email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="Enter your email" error={!!fieldErrors.email} helperText={fieldErrors.email || ''} />
        <TextField fullWidth label="Phone Number" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number" error={!!fieldErrors.phone} helperText={fieldErrors.phone || ''} />
      </Stack>

      <Button type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </Box>
  );

  const renderAddressInfo = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>Address Information</Typography>

      <Stack spacing={3}>
        <TextField fullWidth label="Address Line 1" name="addressLine1" required value={formData.addressLine1} onChange={handleInputChange} placeholder="Enter your address line 1" error={!!fieldErrors.addressLine1} helperText={fieldErrors.addressLine1 || ''} />
        <TextField fullWidth label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Enter your address line 2 (optional)" error={!!fieldErrors.addressLine2} helperText={fieldErrors.addressLine2 || ''} />
        <TextField fullWidth label="City" name="city" required value={formData.city} onChange={handleInputChange} placeholder="Enter your city" error={!!fieldErrors.city} helperText={fieldErrors.city || ''} />
        <TextField fullWidth label="State/Province" name="state" required value={formData.state} onChange={handleInputChange} placeholder="Enter your state" error={!!fieldErrors.state} helperText={fieldErrors.state || ''} />
        <TextField fullWidth label="ZIP/Postal Code" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} placeholder="Enter your ZIP code" error={!!fieldErrors.zipCode} helperText={fieldErrors.zipCode || ''} />
      </Stack>
      <Button type="submit" variant="contained" color="primary" size="large" sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
        Save Changes
      </Button>
    </Box>
  );

  const renderAccountSettings = () => (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>Account Settings</Typography>

      <Box component="form" onSubmit={handlePasswordChange}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Change Password</Typography>
        <Stack spacing={3}>
          <TextField 
            fullWidth 
            label="Current Password" 
            name="currentPassword" 
            type={showPassword.currentPassword ? "text" : "password"} 
            value={formData.currentPassword} 
            onChange={handleInputChange} 
            error={!!fieldErrors.currentPassword} 
            helperText={fieldErrors.currentPassword || ''} 
            placeholder="Enter current password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, currentPassword: !prev.currentPassword }))}
                    edge="end"
                  >
                    {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField 
            fullWidth 
            label="New Password" 
            name="newPassword" 
            type={showPassword.newPassword ? "text" : "password"} 
            value={formData.newPassword} 
            onChange={handleInputChange} 
            error={!!fieldErrors.newPassword} 
            helperText={fieldErrors.newPassword || ''} 
            placeholder="Enter new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, newPassword: !prev.newPassword }))}
                    edge="end"
                  >
                    {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField 
            fullWidth 
            label="Confirm New Password" 
            name="confirmPassword" 
            type={showPassword.confirmPassword ? "text" : "password"} 
            value={formData.confirmPassword} 
            onChange={handleInputChange} 
            error={!!fieldErrors.confirmPassword} 
            helperText={fieldErrors.confirmPassword || ''} 
            placeholder="Confirm new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>
        <Button type="submit" variant="contained" color="primary" disabled={loading} sx={(theme) => ({ ...(theme.palette.mode === 'dark' ? { color: theme.palette.background.dark, backgroundColor: theme.palette.primary.dark, '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' }, '& .MuiButton-startIcon': { color: theme.palette.background.dark }, mt: 3 } : { mt: 3 }) })}>
          {loading ? 'Saving...' : 'Change Password'}
        </Button>
      </Box>
    </Box>
  );

  const renderOrderHistory = () => {
    if (ordersLoading) {
      return (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>
            Order History
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress size={50} />
          </Box>
        </Box>
      );
    }

    if (ordersError) {
      return (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>
            Order History
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {ordersError}
          </Alert>
          <Button variant="contained" onClick={fetchOrderHistory}>
            Retry
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, pb: 2, borderBottom: 2, borderColor: 'primary.main' }}>
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
          <Stack spacing={2}>
            {orders.map((order) => (
              <Card 
                key={order.orderId}
                elevation={0}
                sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                {/* Compact Order Header */}
                <Box 
                  sx={{ 
                    bgcolor: 'grey.50', 
                    px: 2, 
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Typography variant="body1" fontWeight="600" color="primary.main">
                        {formatCurrency(order.totalCost)}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(order.orderStatus)}
                        label={order.orderStatus}
                        color={getStatusColor(order.orderStatus)}
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 2 }}>
                  {/* Compact Services Section */}
                  {order.lineItemDTOS && order.lineItemDTOS.length > 0 ? (
                    <Stack spacing={1.5}>
                      {order.lineItemDTOS.map((lineItem, index) => (
                        <Box 
                          key={lineItem.lineItemId || lineItem.serviceName}
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5, 
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                          }}
                        >
                          {lineItem.imageUrl && (
                            <Avatar
                              src={lineItem.imageUrl}
                              variant="rounded"
                              sx={{ 
                                width: 40, 
                                height: 40,
                                flexShrink: 0
                              }}
                            />
                          )}
                          <Box flex={1} minWidth={0}>
                            <Typography variant="body2" fontWeight="500" color="text.primary" noWrap>
                              {lineItem.serviceName}
                            </Typography>
                            {lineItem.quantityUnits && (
                              <Typography variant="caption" color="text.secondary">
                                Qty: {lineItem.quantityUnits}
                              </Typography>
                            )}
                          </Box>
                          <Typography variant="body2" fontWeight="600" color="text.primary" sx={{ flexShrink: 0 }}>
                            {formatCurrency(lineItem.cost)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No service details available
                    </Typography>
                  )}

                  {/* Compact Provider Info and Actions */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'grey.200' }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        width: 28, 
                        height: 28 
                      }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="500" color="text.primary">
                          {order.providerId?.providerName || 'Provider'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleReorderServices(order)}
                      disabled={order.orderStatus === 'CANCELLED'}
                      sx={{ 
                        borderRadius: 1.5,
                        px: 2,
                        fontSize: '0.75rem'
                      }}
                    >
                      Reorder
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'address':
        return renderAddressInfo();
      case 'orders':
        return renderOrderHistory();
      case 'settings':
        return renderAccountSettings();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 200px)', py: 5, bgcolor: 'background.default' }}>
      <Container maxWidth="lg" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start" sx={{ mt: 6 }}>
          <Box sx={{ width: { xs: '100%', md: '280px' } }}>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} profilePicturePreview={formData?.profilePictureUrl} />
          </Box>
          <Box sx={{ width: '100%', flex: 1 }}>
            <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>{renderContent()}</Paper>
          </Box>
        </Stack>
      </Container>
      
      {/* Provider Conflict Dialog */}
      <Dialog
        open={conflictDialogOpen}
        onClose={handleCancelReorder}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
              borderRadius: 2
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: theme.palette.mode === 'dark' ? 'warning.light' : 'warning.main'
        }}>
          <WarningIcon color="warning" />
          Different Service Provider
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.primary }}>
            You can only order services from one provider at a time.
          </DialogContentText>
          <DialogContentText sx={{ 
            mt: 2, 
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            Current cart: {currentCartProvider}
          </DialogContentText>
          <DialogContentText sx={{ 
            mt: 1,
            color: theme.palette.text.secondary
          }}>
            To reorder services from <strong>{conflictOrder?.providerId?.providerName}</strong>, 
            your current cart will be cleared first.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCancelReorder}
            variant="outlined"
            sx={{
              borderColor: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.400',
              color: theme.palette.text.primary
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmReorder}
            variant="contained"
            color="warning"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.main',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'warning.main' : 'warning.dark'
              }
            }}
          >
            Clear Cart & Reorder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Popup Dialog */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
              borderRadius: 2,
              textAlign: 'center'
            }
          }
        }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {popupType === 'success' && (
              <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
            )}
            {popupType === 'error' && (
              <Cancel sx={{ fontSize: 48, color: 'error.main' }} />
            )}
            {popupType === 'warning' && (
              <WarningIcon sx={{ fontSize: 48, color: 'warning.main' }} />
            )}
            <Typography variant="h6" fontWeight="600" color="text.primary">
              {popupType === 'success' && 'Success!'}
              {popupType === 'error' && 'Error'}
              {popupType === 'warning' && 'Warning'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {popupMessage}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleClosePopup}
            variant="contained"
            color={popupType === 'error' ? 'error' : popupType === 'warning' ? 'warning' : 'primary'}
            sx={{ px: 4 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
