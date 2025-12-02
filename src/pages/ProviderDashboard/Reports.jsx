import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import apiClient from '../../utils/apiClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = ({ provider }) => {
  const [reportType, setReportType] = useState('bookings');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch orders from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch orders for the provider
        const ordersData = await apiClient.get(`/api/v1/orders/provider/${provider.providerId}`);
        const ordersArray = Array.isArray(ordersData) ? ordersData : [];
        
        // Enrich orders with user and service details
        const enrichedOrders = await Promise.all(
          ordersArray.map(async (order) => {
            try {
              let userName = 'Unknown User';
              let serviceName = 'Unknown Service';
              
              // Fetch user details
              if (order.userId) {
                try {
                  const userData = await apiClient.get(`/api/v1/users/${order.userId}`);
                  userName = userData?.name || `User ${order.userId}`;
                } catch (userError) {
                  console.warn(`Failed to fetch user ${order.userId}:`, userError);
                }
              }
              
              // Fetch service details
              if (order.serviceId) {
                try {
                  const serviceData = await apiClient.get(`/api/v1/services/${order.serviceId}`);
                  serviceName = serviceData?.serviceName || `Service ${order.serviceId}`;
                } catch (serviceError) {
                  console.warn(`Failed to fetch service ${order.serviceId}:`, serviceError);
                }
              }
              
              return {
                ...order,
                userName,
                serviceName
              };
            } catch (error) {
              console.warn('Failed to enrich order:', error);
              return {
                ...order,
                userName: 'Unknown User',
                serviceName: 'Unknown Service'
              };
            }
          })
        );
        
        setOrders(enrichedOrders);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err.message || 'Failed to load report data');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [provider?.providerId]);

  // Filter data based on date range
  const getFilteredData = useCallback((data, dateField = 'createdAt') => {
    if (dateRange === 'all') return data;

    const now = new Date();
    let startDate = null;

    switch (dateRange) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          return data.filter(item => {
            const itemDate = new Date(item[dateField]);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        return data;
      default:
        return data;
    }

    if (startDate) {
      return data.filter(item => new Date(item[dateField]) >= startDate);
    }

    return data;
  }, [dateRange, customStartDate, customEndDate]);

  // Calculate report data
  const reportData = useMemo(() => {
    const filteredBookings = getFilteredData(orders, 'createdAt');

    // Bookings summary - normalize orderStatus to lowercase for comparison
    const totalBookings = filteredBookings.length;
    const pendingBookings = filteredBookings.filter(b => b.orderStatus?.toLowerCase() === 'pending').length;
    const confirmedBookings = filteredBookings.filter(b => b.orderStatus?.toLowerCase() === 'confirmed').length;
    const completedBookings = filteredBookings.filter(b => b.orderStatus?.toLowerCase() === 'completed').length;
    const cancelledBookings = filteredBookings.filter(b => b.orderStatus?.toLowerCase() === 'cancelled').length;

    // Revenue summary - using totalCost field
    const totalRevenue = filteredBookings
      .filter(b => b.orderStatus?.toLowerCase() === 'completed')
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const pendingRevenue = filteredBookings
      .filter(b => b.orderStatus?.toLowerCase() === 'pending')
      .reduce((sum, b) => sum + (b.totalCost || 0), 0);

    // Service-wise breakdown
    const serviceBreakdown = {};
    filteredBookings.forEach(booking => {
      const serviceKey = booking.serviceName || 'Unknown Service';
      if (!serviceBreakdown[serviceKey]) {
        serviceBreakdown[serviceKey] = {
          count: 0,
          revenue: 0,
          completed: 0,
          cancelled: 0
        };
      }
      serviceBreakdown[serviceKey].count++;
      if (booking.orderStatus?.toLowerCase() === 'completed') {
        serviceBreakdown[serviceKey].revenue += (booking.totalCost || 0);
        serviceBreakdown[serviceKey].completed++;
      }
      if (booking.orderStatus?.toLowerCase() === 'cancelled') {
        serviceBreakdown[serviceKey].cancelled++;
      }
    });

    return {
      bookings: filteredBookings,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      pendingRevenue,
      serviceBreakdown
    };
  }, [orders, getFilteredData]);

  // Export to CSV
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'bookings') {
      filename = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Order ID,User Name,Service Name,Date,Status,Total Cost\n';
      reportData.bookings.forEach(booking => {
        csvContent += `${booking.orderId},${booking.userName},${booking.serviceName},${new Date(booking.createdAt).toLocaleDateString()},${booking.orderStatus},${booking.totalCost}\n`;
      });
    } else if (reportType === 'revenue') {
      filename = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Service Name,Total Bookings,Completed,Cancelled,Revenue\n';
      Object.entries(reportData.serviceBreakdown).forEach(([name, stats]) => {
        csvContent += `${name},${stats.count},${stats.completed},${stats.cancelled},${stats.revenue}\n`;
      });
      csvContent += `\nTotal Revenue,,,₹${reportData.totalRevenue}\n`;
    }

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Export to PDF (simplified version)
  const exportToPDF = () => {
    const doc = new jsPDF();
    const dateRangeText = dateRange === 'custom' 
      ? `${customStartDate} to ${customEndDate}`
      : dateRange.charAt(0).toUpperCase() + dateRange.slice(1);

    // Header
    doc.setFontSize(18);
    doc.text(`${provider?.providerName || 'Provider'} Reports`, 14, 15);
    doc.setFontSize(11);
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 14, 22);
    doc.setFontSize(9);
    doc.text(`Date Range: ${dateRangeText}`, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 33);

    let yPos = 40;

    if (reportType === 'bookings') {
      // Summary boxes
      doc.setFontSize(10);
      doc.text(`Total: ${reportData.totalBookings} | Pending: ${reportData.pendingBookings} | Completed: ${reportData.completedBookings} | Cancelled: ${reportData.cancelledBookings}`, 14, yPos);
      yPos += 7;

      // Table
      const tableData = reportData.bookings.map(b => [
        b.orderId,
        b.userName || 'Unknown User',
        b.serviceName || 'Unknown Service',
        new Date(b.createdAt).toLocaleDateString(),
        b.orderStatus,
        `Rs. ${b.totalCost || 0}`
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Order ID', 'Customer', 'Service', 'Date', 'Status', 'Total Cost']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 8 }
      });
    } else if (reportType === 'revenue') {
      // Summary
      doc.setFontSize(10);
      doc.text(`Total Revenue: Rs. ${reportData.totalRevenue.toLocaleString()} | Pending: Rs. ${reportData.pendingRevenue.toLocaleString()}`, 14, yPos);
      yPos += 7;

      // Service breakdown table
      const tableData = Object.entries(reportData.serviceBreakdown)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .map(([name, stats]) => [
          name,
          stats.count.toString(),
          stats.completed.toString(),
          stats.cancelled.toString(),
          `Rs. ${stats.revenue.toLocaleString()}`
        ]);

      // Add total row
      tableData.push(['TOTAL', '', '', '', `Rs. ${reportData.totalRevenue.toLocaleString()}`]);

      autoTable(doc, {
        startY: yPos,
        head: [['Service Name', 'Bookings', 'Completed', 'Cancelled', 'Revenue']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 8 },
        didParseCell: function(data) {
          // Make total row bold
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [240, 240, 240];
          }
        }
      });
    }

    // Save PDF
    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  const renderBookingsReport = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{reportData.totalBookings}</Typography>
              <Typography variant="body2" color="text.secondary">Total Bookings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{reportData.pendingBookings}</Typography>
              <Typography variant="body2" color="text.secondary">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{reportData.completedBookings}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">{reportData.cancelledBookings}</Typography>
              <Typography variant="body2" color="text.secondary">Cancelled</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Service Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.bookings.map((booking) => (
              <TableRow key={booking.orderId}>
                <TableCell>{booking.orderId}</TableCell>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.serviceName}</TableCell>
                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={booking.orderStatus} 
                    size="small"
                    color={
                      booking.orderStatus?.toLowerCase() === 'completed' ? 'success' :
                      booking.orderStatus?.toLowerCase() === 'confirmed' ? 'info' :
                      booking.orderStatus?.toLowerCase() === 'pending' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell align="right">₹{booking.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderRevenueReport = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">₹{reportData.totalRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue (Paid)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">₹{reportData.pendingRevenue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align="center">Total Bookings</TableCell>
              <TableCell align="center">Completed</TableCell>
              <TableCell align="center">Cancelled</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(reportData.serviceBreakdown)
              .sort(([, a], [, b]) => b.revenue - a.revenue)
              .map(([serviceName, stats]) => (
                <TableRow key={serviceName}>
                  <TableCell>{serviceName}</TableCell>
                  <TableCell align="center">{stats.count}</TableCell>
                  <TableCell align="center">{stats.completed}</TableCell>
                  <TableCell align="center">{stats.cancelled}</TableCell>
                  <TableCell align="right">₹{stats.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell colSpan={4} sx={{ fontWeight: 700 }}>Total</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>₹{reportData.totalRevenue.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Reports & Export</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate and export business reports
      </Typography>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="bookings">Bookings Report</MenuItem>
              <MenuItem value="revenue">Revenue Report</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Date Range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 30 Days</MenuItem>
              <MenuItem value="quarter">Last 3 Months</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<ExcelIcon />}
                onClick={exportToCSV}
                fullWidth
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                startIcon={<PdfIcon />}
                onClick={exportToPDF}
                fullWidth
              >
                Export PDF
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {dateRange === 'custom' && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )}
      </Card>

      {/* Report Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {reportType === 'bookings' && renderBookingsReport()}
          {reportType === 'revenue' && renderRevenueReport()}
        </>
      )}
    </Paper>
  );
};

export default Reports;
