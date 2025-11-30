import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
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
} from '@mui/icons-material';
import { MOCK_BOOKINGS } from '../../../mockData';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'warning', bgColor: '#fff3e0', textColor: '#e65100' },
  confirmed: { label: 'Confirmed', color: 'info', bgColor: '#e3f2fd', textColor: '#1565c0' },
  completed: { label: 'Completed', color: 'success', bgColor: '#e8f5e9', textColor: '#2e7d32' },
  cancelled: { label: 'Cancelled', color: 'error', bgColor: '#ffebee', textColor: '#c62828' },
};

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'warning' },
  paid: { label: 'Paid', color: 'success' },
  refunded: { label: 'Refunded', color: 'default' },
};

const BookingsList = ({ provider }) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuBookingId, setMenuBookingId] = useState(null);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirm = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      )
    );
    handleCloseMenu();
  };

  const handleComplete = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'completed', completedAt: new Date().toISOString(), paymentStatus: 'paid' }
          : b
      )
    );
    handleCloseMenu();
  };

  const handleCancel = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : b
      )
    );
    handleCloseMenu();
  };

  const handleOpenMenu = (event, bookingId) => {
    setMenuAnchor(event.currentTarget);
    setMenuBookingId(bookingId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuBookingId(null);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const statusCounts = useMemo(() => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
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
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
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
    const config = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.pending;
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
      </Box>

      <Tabs
        value={statusFilter}
        onChange={(e, newValue) => setStatusFilter(newValue)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`All (${statusCounts.all})`} value="all" />
        <Tab label={`Pending (${statusCounts.pending})`} value="pending" />
        <Tab label={`Confirmed (${statusCounts.confirmed})`} value="confirmed" />
        <Tab label={`Completed (${statusCounts.completed})`} value="completed" />
        <Tab label={`Cancelled (${statusCounts.cancelled})`} value="cancelled" />
      </Tabs>

      {filteredBookings.length === 0 ? (
        <Alert severity="info">No bookings found matching your criteria.</Alert>
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
                  onClick={() => handleViewDetails(booking)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleViewDetails(booking);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                        {booking.customerName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {booking.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.customerEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{booking.serviceName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(booking.scheduledDate)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {booking.scheduledTime}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${booking.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(booking.status)}</TableCell>
                  <TableCell>{getPaymentChip(booking.paymentStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Actions Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        {bookings.find((b) => b.id === menuBookingId)?.status === 'pending' && (
          <MenuItem onClick={() => handleConfirm(menuBookingId)}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} color="info" />
            Confirm Booking
          </MenuItem>
        )}
        {bookings.find((b) => b.id === menuBookingId)?.status === 'confirmed' && (
          <MenuItem onClick={() => handleComplete(menuBookingId)}>
            <DoneIcon fontSize="small" sx={{ mr: 1 }} color="success" />
            Mark as Completed
          </MenuItem>
        )}
        <MenuItem onClick={() => handleCancel(menuBookingId)}>
          <CancelIcon fontSize="small" sx={{ mr: 1 }} color="error" />
          Cancel Booking
        </MenuItem>
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
                    {selectedBooking.customerName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedBooking.customerName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Booking ID: {selectedBooking.id}
                    </Typography>
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
                    <Typography variant="body2">{selectedBooking.address}</Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Service Details
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedBooking.serviceName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">{formatDate(selectedBooking.scheduledDate)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedBooking.scheduledTime}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${selectedBooking.amount}
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
          {selectedBooking?.status === 'pending' && (
            <Button
              onClick={() => {
                handleConfirm(selectedBooking.id);
                handleCloseDetails();
              }}
              variant="contained"
              color="info"
              startIcon={<CheckCircleIcon />}
            >
              Confirm Booking
            </Button>
          )}
          {selectedBooking?.status === 'confirmed' && (
            <Button
              onClick={() => {
                handleComplete(selectedBooking.id);
                handleCloseDetails();
              }}
              variant="contained"
              color="success"
              startIcon={<DoneIcon />}
            >
              Mark as Completed
            </Button>
          )}
          {selectedBooking?.status !== 'cancelled' && selectedBooking?.status !== 'completed' && (
            <Button
              onClick={() => {
                handleCancel(selectedBooking.id);
                handleCloseDetails();
              }}
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
            >
              Cancel Booking
            </Button>
          )}
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BookingsList;
