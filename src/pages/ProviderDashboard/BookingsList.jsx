import React, { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Stack,
  Avatar,
  Divider,
  Grid,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Done as DoneIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import apiClient from '../../utils/apiClient';
import toastMessage from '../../utils/toastMessage';

const STATUS_CONFIG = {
  REQUESTED: { label: 'Pending', color: 'warning', bgColor: '#fff3e0', textColor: '#e65100' },
  PAID: { label: 'Paid', color: 'info', bgColor: '#e3f2fd', textColor: '#1565c0' },
  SCHEDULED: { label: 'Scheduled', color: 'info', bgColor: '#e3f2fd', textColor: '#1565c0' },
  COMPLETED: { label: 'Completed', color: 'success', bgColor: '#e8f5e9', textColor: '#2e7d32' },
  CANCELLED: { label: 'Cancelled', color: 'error', bgColor: '#ffebee', textColor: '#c62828' },
};

const PAYMENT_STATUS_CONFIG = {
  REQUESTED: { label: 'Pending', color: 'warning' },
  PAID: { label: 'Paid', color: 'success' },
  SCHEDULED: { label: 'Paid', color: 'success' },
  COMPLETED: { label: 'Paid', color: 'success' },
  CANCELLED: { label: 'Refunded', color: 'default' },
};

const BookingsList = ({ provider }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuBookingId, setMenuBookingId] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');

  // Fetch bookings when component mounts or provider changes
  useEffect(() => {
    if (provider?.providerId) {
      fetchBookings();
    }
  }, [provider?.providerId, fetchBookings]);

  const fetchBookings = async () => {
    if (!provider?.providerId) {
      toastMessage({ msg: 'Provider information not available', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const orders = await apiClient.get(`/api/v1/orders/provider/${provider.providerId}`);
      
      // Fetch additional details for each order
      const enrichedBookings = await Promise.all(
        orders.map(async (order) => {
          try {
            // Fetch user details
            let userDetails = null;
            if (order.userId) {
              try {
                userDetails = await apiClient.get(`/api/v1/users/${order.userId}`);
              } catch (error) {
                console.warn('Failed to fetch user details:', error);
              }
            }

            // Fetch service details
            let serviceDetails = null;
            if (order.serviceId) {
              try {
                serviceDetails = await apiClient.get(`/api/v1/services/${order.serviceId}`);
              } catch (error) {
                console.warn('Failed to fetch service details:', error);
              }
            }

            // Transform order data with enriched details
            return {
              id: order.orderId?.toString() || order.id?.toString(),
              orderId: order.orderId || order.id,
              customerName: userDetails?.name || 'Unknown Customer',
              customerEmail: userDetails?.email || 'unknown@email.com',
              customerPhone: userDetails?.phone || 'N/A',
              serviceName: serviceDetails?.serviceName || 'Unknown Service',
              serviceId: order.serviceId,
              serviceCategory: serviceDetails?.category || 'General',
              serviceDescription: serviceDetails?.description || '',
              status: order.orderStatus || 'REQUESTED',
              paymentStatus: order.orderStatus || 'REQUESTED',
              amount: order.totalCost || 0,
              quantity: order.quantity || 1,
              scheduledDate: order.scheduledDate || null, // Only use actual scheduled date, not fallback
              scheduledTime: order.scheduledDate ? new Date(order.scheduledDate).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
              }) : 'TBD',
              createdAt: order.createdAt || new Date().toISOString(),
              completedAt: order.orderStatus === 'COMPLETED' ? order.updatedAt : null,
              cancelledAt: order.orderStatus === 'CANCELLED' ? order.updatedAt : null,
              transactionId: order.transactionId,
              paymentDate: order.paymentDate,
              address: userDetails ? 
                `${userDetails.addressLine1 || ''}${userDetails.addressLine2 ? '\n' + userDetails.addressLine2 : ''}${userDetails.city ? '\n' + userDetails.city : ''}${userDetails.state ? ', ' + userDetails.state : ''}${userDetails.zipCode ? ' - ' + userDetails.zipCode : ''}`.replace(/^\n/, '').trim() 
                : 'Address not provided',
              notes: order.notes || '',
              // Store original references for potential future use
              originalUser: userDetails,
              originalService: serviceDetails,
              originalOrder: order,
            };
          } catch (error) {
            console.error('Error enriching order data:', error);
            // Return basic order data if enrichment fails
            return {
              id: order.orderId?.toString() || order.id?.toString(),
              orderId: order.orderId || order.id,
              customerName: 'Unknown Customer',
              customerEmail: 'unknown@email.com',
              customerPhone: 'N/A',
              serviceName: 'Unknown Service',
              serviceId: order.serviceId,
              status: order.orderStatus || 'REQUESTED',
              paymentStatus: order.orderStatus || 'REQUESTED',
              amount: order.totalCost || 0,
              quantity: order.quantity || 1,
              scheduledDate: order.scheduledDate || null, // Only use actual scheduled date, not fallback
              scheduledTime: 'TBD',
              createdAt: order.createdAt || new Date().toISOString(),
              completedAt: null,
              cancelledAt: null,
              transactionId: order.transactionId,
              paymentDate: order.paymentDate,
              address: 'Address not provided',
              notes: order.notes || '',
              originalOrder: order,
            };
          }
        })
      );

      setBookings(enrichedBookings);
      
      // Show success message with details about data completeness
      const failedUserFetches = enrichedBookings.filter(b => !b.originalUser).length;
      const failedServiceFetches = enrichedBookings.filter(b => !b.originalService).length;
      
      if (failedUserFetches === 0 && failedServiceFetches === 0) {
        toastMessage({ msg: 'Bookings loaded successfully with complete details', type: 'success' });
      } else {
        let message = 'Bookings loaded';
        if (failedUserFetches > 0) message += ` (${failedUserFetches} customer details unavailable)`;
        if (failedServiceFetches > 0) message += ` (${failedServiceFetches} service details unavailable)`;
        toastMessage({ msg: message, type: 'warning' });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toastMessage({ msg: 'Failed to load bookings. Please try again.', type: 'error' });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    // Reset scheduled date when opening details
    setScheduledDate('');
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
    setScheduledDate('');
  };

  const updateBookingStatus = async (bookingId, newStatus, scheduledDateTime = null) => {
    setUpdating(true);
    try {
      const requestBody = {
        orderStatus: newStatus
      };
      
      // Include scheduled date if provided (when updating to SCHEDULED status)
      if (newStatus === 'SCHEDULED' && scheduledDateTime) {
        // Convert date to ISO instant format for backend
        const scheduledDate = new Date(scheduledDateTime);
        scheduledDate.setHours(9, 0, 0, 0); // Set to 9:00 AM as default time
        requestBody.scheduledDate = scheduledDate.toISOString();
      }

      const response = await apiClient.patch(`/api/v1/orders/${bookingId}`, requestBody);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const _updatedOrder = await response.json();
      
      // Update the local bookings state
      setBookings((prev) =>
        prev.map((b) =>
          b.orderId === bookingId ? { 
            ...b, 
            status: newStatus, 
            paymentStatus: newStatus,
            scheduledDate: newStatus === 'SCHEDULED' && scheduledDateTime ? scheduledDateTime : b.scheduledDate,
            completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : b.completedAt,
            cancelledAt: newStatus === 'CANCELLED' ? new Date().toISOString() : b.cancelledAt
          } : b
        )
      );
      
      toastMessage({ msg: `Booking ${newStatus.toLowerCase()} successfully`, type: 'success' });
      return true; // Return success
    } catch (error) {
      console.error('Error updating booking status:', error);
      toastMessage({ msg: 'Failed to update booking status. Please try again.', type: 'error' });
      throw error; // Re-throw error so handleConfirm can catch it
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    if (!scheduledDate) {
      toastMessage({ msg: 'Please select a scheduled date before confirming the booking', type: 'error' });
      return;
    }
    
    // Validate that scheduled date is not in the past
    const selectedDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toastMessage({ msg: 'Scheduled date cannot be in the past', type: 'error' });
      return;
    }
    
    try {
      await updateBookingStatus(bookingId, 'SCHEDULED', scheduledDate);
      handleCloseMenu();
      handleCloseDetails(); // Close dialog on success
      setScheduledDate(''); // Reset the scheduled date
    } catch (error) {
      // Don't close dialog on error so user can try again
      console.error('Error confirming booking:', error);
    }
  };

  const handleComplete = (bookingId) => {
    updateBookingStatus(bookingId, 'COMPLETED');
    handleCloseMenu();
  };

  const handleCancel = (bookingId) => {
    updateBookingStatus(bookingId, 'CANCELLED');
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuBookingId(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        (booking.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.id || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: bookings.length,
      REQUESTED: bookings.filter((b) => b.status === 'REQUESTED').length,
      PAID: bookings.filter((b) => b.status === 'PAID').length,
      SCHEDULED: bookings.filter((b) => b.status === 'SCHEDULED').length,
      COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
      CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
    };
  }, [bookings]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusChip = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.REQUESTED;
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.bgColor,
          color: config.textColor,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  };

  const getPaymentChip = (paymentStatus) => {
    const config = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.REQUESTED;
    return (
      <Chip
        label={config.label}
        size="small"
        color={config.color}
        variant="outlined"
      />
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Bookings Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={fetchBookings}
            disabled={loading}
            size="small"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Tabs
        value={statusFilter}
        onChange={(e, newValue) => setStatusFilter(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`All (${statusCounts.all})`} value="all" />
        <Tab label={`Pending (${statusCounts.REQUESTED})`} value="REQUESTED" />
        <Tab label={`Paid (${statusCounts.PAID})`} value="PAID" />
        <Tab label={`Scheduled (${statusCounts.SCHEDULED})`} value="SCHEDULED" />
        <Tab label={`Completed (${statusCounts.COMPLETED})`} value="COMPLETED" />
        <Tab label={`Cancelled (${statusCounts.CANCELLED})`} value="CANCELLED" />
      </Tabs>

      {loading ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>Loading bookings and enriching with customer and service details...</Typography>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
              <Skeleton variant="rectangular" width={100} height={20} />
              <Skeleton variant="rectangular" width={80} height={20} />
            </Box>
          ))}
        </Box>
      ) : filteredBookings.length === 0 ? (
        <Alert severity="info">
          {bookings.length === 0 
            ? "No bookings found. Bookings will appear here once customers make orders." 
            : "No bookings found matching your criteria."
          }
        </Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Service</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell 
                    onClick={() => handleViewDetails(booking)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                        {(booking.customerName || '?').charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.customerName || 'Unknown Customer'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.customerEmail || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(booking)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="body2">{booking.serviceName || 'Unknown Service'}</Typography>
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(booking)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="body2">
                      {booking.scheduledDate ? formatDate(booking.scheduledDate) : 'Not Scheduled'}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(booking)} sx={{ cursor: 'pointer' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{booking.amount || 0}
                      {booking.quantity > 1 && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          (Qty: {booking.quantity})
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(booking)} sx={{ cursor: 'pointer' }}>
                    {getStatusChip(booking.status)}
                  </TableCell>
                  <TableCell onClick={() => handleViewDetails(booking)} sx={{ cursor: 'pointer' }}>
                    {getPaymentChip(booking.paymentStatus)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        {bookings.find((b) => b.orderId === menuBookingId)?.status === 'REQUESTED' && (
          <MenuItem onClick={() => handleConfirm(menuBookingId)} disabled={updating}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} color="info" />
            Schedule Booking
          </MenuItem>
        )}
        {bookings.find((b) => b.orderId === menuBookingId)?.status === 'SCHEDULED' && (
          <MenuItem onClick={() => handleComplete(menuBookingId)} disabled={updating}>
            <DoneIcon fontSize="small" sx={{ mr: 1 }} color="success" />
            Mark as Completed
          </MenuItem>
        )}
        {['REQUESTED', 'PAID', 'SCHEDULED'].includes(bookings.find((b) => b.orderId === menuBookingId)?.status) && (
          <MenuItem onClick={() => handleCancel(menuBookingId)} disabled={updating}>
            <CancelIcon fontSize="small" sx={{ mr: 1 }} color="error" />
            Cancel Booking
          </MenuItem>
        )}
      </Menu>

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Booking Details
            </Typography>
            {selectedBooking && getStatusChip(selectedBooking.status)}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedBooking && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
                      {(selectedBooking.customerName || '?').charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedBooking.customerName || 'Unknown Customer'}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Booking ID: {selectedBooking.orderId || selectedBooking.id}
                      </Typography>
                      {selectedBooking.transactionId && (
                        <Typography variant="body2" color="text.secondary">
                          Transaction: {selectedBooking.transactionId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedBooking.customerEmail}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedBooking.customerPhone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{selectedBooking.address}</Typography>
                  </Box>
                  {selectedBooking.originalUser && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Customer ID: {selectedBooking.originalUser.userId || selectedBooking.originalUser.id}
                      </Typography>
                      {selectedBooking.originalUser.createdAt && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Member since: {formatDate(selectedBooking.originalUser.createdAt)}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Service Details
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedBooking.serviceName || 'Unknown Service'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Requested Date:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <CalendarTodayIcon fontSize="small" color="action" />
                      <Typography variant="body2">{formatDate(selectedBooking.originalOrder?.requestedDate || selectedBooking.createdAt)}</Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Scheduled Date:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="body2">{selectedBooking.scheduledDate ? formatDate(selectedBooking.scheduledDate) : 'Not Scheduled'}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{selectedBooking.amount || 0}
                      {selectedBooking.quantity > 1 && ` (Qty: ${selectedBooking.quantity})`}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Payment Status
                </Typography>
                <Box>{getPaymentChip(selectedBooking.paymentStatus)}</Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Booking Status
                </Typography>
                <Box>{getStatusChip(selectedBooking.status)}</Box>
              </Grid>

              {/* Scheduled Date Picker - Only show for REQUESTED bookings */}
              {selectedBooking?.status === 'REQUESTED' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scheduled Date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        backgroundColor: 'white',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      ),
                    }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0], // Prevent past dates
                    }}
                    helperText="Select a date when you will provide the service"
                    sx={{
                      '& .MuiInputLabel-root': {
                        backgroundColor: 'white',
                        paddingX: 1,
                      }
                    }}
                  />
                </Grid>
              )}

              {/* Show scheduled date for non-REQUESTED bookings */}
              {selectedBooking?.status !== 'REQUESTED' && selectedBooking?.scheduledDate && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Scheduled Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedBooking.scheduledDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Grid>
              )}

              {selectedBooking.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Customer Notes
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">{selectedBooking.notes}</Typography>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body2">{formatDateTime(selectedBooking.createdAt)}</Typography>
              </Grid>

              {selectedBooking.completedAt && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Completed At
                  </Typography>
                  <Typography variant="body2">{formatDateTime(selectedBooking.completedAt)}</Typography>
                </Grid>
              )}

              {selectedBooking.cancelledAt && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Cancelled At
                  </Typography>
                  <Typography variant="body2">{formatDateTime(selectedBooking.cancelledAt)}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedBooking?.status === 'REQUESTED' && (
            <Button
              onClick={() => handleConfirm(selectedBooking.orderId)}
              variant="contained"
              color="info"
              startIcon={<CheckCircleIcon />}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Schedule Booking'}
            </Button>
          )}
          {selectedBooking?.status === 'SCHEDULED' && (
            <Button
              onClick={() => {
                handleComplete(selectedBooking.orderId);
                handleCloseDetails();
              }}
              variant="contained"
              color="success"
              startIcon={<DoneIcon />}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Mark as Completed'}
            </Button>
          )}
          {['REQUESTED', 'PAID', 'SCHEDULED'].includes(selectedBooking?.status) && (
            <Button
              onClick={() => {
                handleCancel(selectedBooking.orderId);
                handleCloseDetails();
              }}
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Cancel Booking'}
            </Button>
          )}
          <Button onClick={handleCloseDetails} disabled={updating}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BookingsList;
