import { Card, CardContent, Typography, CardMedia, Box, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useThemeMode } from '../../theme/useThemeMode';
import StarIcon from '@mui/icons-material/Star';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { addItem, clearCart, removeItem } from '../../store/cartSlice';
import toastMessage from '../../utils/toastMessage';

export default function ServiceCard({ serviceId, name, description, image, provider, price, rating, location, availability, providerId, fullService }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const cartItems = useSelector((state) => state.cart.items);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingService, setPendingService] = useState(null);

  // Check if this service is already in cart
  const isInCart = cartItems.some(item => item.serviceId === serviceId);

  const handleCardClick = () => {
    if (providerId) {
      navigate(`/service-providers/${providerId}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click

    if (!fullService) {
      console.log('No fullService provided');
      return;
    }

    // If already in cart, just show message
    if (isInCart) {
      toastMessage('info', 'This service is already in your cart');
      return;
    }

    // Check if cart has items from different provider
    if (cartItems.length > 0) {
      const currentProviderId = cartItems[0].providerId;
      const newProviderId = fullService.providerId?.providerId;

      if (currentProviderId !== newProviderId) {
        // Show dialog instead of toast
        setPendingService(fullService);
        setOpenDialog(true);
        return;
      }
    }

    // Add service to cart
    dispatch(addItem({
      serviceId: fullService.serviceId,
      serviceName: fullService.serviceName,
      description: fullService.description,
      cost: fullService.cost,
      imageUrl: fullService.imageUrl,
      providerId: fullService.providerId?.providerId,
      providerName: fullService.providerId?.providerName,
      location: fullService.location,
    }));

    toastMessage('success', `${fullService.serviceName} added to cart!`);
  };

  const handleEmptyCartAndAdd = (e) => {
    e.stopPropagation();
    // Clear cart and add new service
    dispatch(clearCart());
    if (pendingService) {
      dispatch(addItem({
        serviceId: pendingService.serviceId,
        serviceName: pendingService.serviceName,
        description: pendingService.description,
        cost: pendingService.cost,
        imageUrl: pendingService.imageUrl,
        providerId: pendingService.providerId?.providerId,
        providerName: pendingService.providerId?.providerName,
        location: pendingService.location,
      }));
      toastMessage('success', `Cart cleared. ${pendingService.serviceName} added to cart!`);
    }
    setOpenDialog(false);
    setPendingService(null);
  };

  const handleCloseDialog = (e) => {
    e.stopPropagation();
    setOpenDialog(false);
    setPendingService(null);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation(); // Prevent card click
    dispatch(removeItem((item) => item.serviceId === serviceId));
    toastMessage('success', 'Service removed from cart');
  };

  const formatPrice = (priceValue) => {
    if (!priceValue) return 'N/A';
    return `₹${Number(priceValue).toFixed(2)}`;
  };

  return (
    <Card
      variant="outlined"
      onClick={handleCardClick}
      sx={{
        height: 420,
        width: 285,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        mx: 'auto',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: mode === 'dark' ? '0 8px 16px rgba(255,255,255,0.1)' : '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      {image && (
        <CardMedia
          component="img"
          height="160"
          image={image}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
      )}
      {!image && (
        <Box
          sx={{
            height: 160,
            background: mode === 'dark' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '3rem',
            fontWeight: 'bold'
          }}
        >
          {name.charAt(0)}
        </Box>
      )}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: name.length > 30 ? '0.95rem' : name.length > 20 ? '1.0rem' : '1.1rem',
              fontWeight: 600,
              mb: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              minHeight: '2em',
              maxHeight: '2.6em'
            }}
          >
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.8, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {description || 'No description available'}
          </Typography>
        </Box>
        <Box>
          {provider && <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>Provider: <strong>{provider}</strong></Typography>}
          {location && <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 0.5 }}>Location: {location}</Typography>}
          {price && (
            <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
              {formatPrice(price)}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            {rating && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: '#ffa726', fontSize: '1.1rem', mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {Number(rating).toFixed(1)}
                </Typography>
              </Box>
            )}
            {availability && (
              <Chip
                label={availability}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: 22,
                  backgroundColor: availability === 'Available' ? '#4caf50' : '#f44336',
                  color: '#fff',
                  fontWeight: 500
                }}
              />
            )}
          </Box>

          {/* Add to Cart / Remove Button */}
          {isInCart ? (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
              <Button
                variant="outlined"
                color="success"
                fullWidth
                size="small"
                startIcon={<CheckCircleIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  pointerEvents: 'none'
                }}
              >
                Added to Cart
              </Button>
              <IconButton
                color="error"
                size="small"
                onClick={handleRemoveFromCart}
                sx={{
                  border: '1px solid',
                  borderColor: 'error.main',
                  borderRadius: 1,
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
              fullWidth
              size="small"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={availability === 'Not Available'}
              sx={{
                mt: 1.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Add to Cart
            </Button>
          )}
        </Box>
      </CardContent>

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
            To add this service from <strong>{pendingService?.providerId?.providerName}</strong>,
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
    </Card>
  );
}
