import { useState, useMemo } from 'react';
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
  Alert
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { MOCK_BOOKINGS, MOCK_PROVIDER_REVIEWS, MOCK_PROVIDER } from '../../../mockData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = ({ provider }) => {
  const [reportType, setReportType] = useState('bookings');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Filter data based on date range
  const getFilteredData = (data, dateField = 'createdAt') => {
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
  };

  // Calculate report data
  const reportData = useMemo(() => {
    const filteredBookings = getFilteredData(MOCK_BOOKINGS);
    const filteredReviews = getFilteredData(MOCK_PROVIDER_REVIEWS);

    // Bookings summary
    const totalBookings = filteredBookings.length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = filteredBookings.filter(b => b.status === 'confirmed').length;
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const cancelledBookings = filteredBookings.filter(b => b.status === 'cancelled').length;

    // Revenue summary
    const totalRevenue = filteredBookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0);
    const pendingRevenue = filteredBookings
      .filter(b => b.paymentStatus === 'pending')
      .reduce((sum, b) => sum + b.amount, 0);

    // Service-wise breakdown
    const serviceBreakdown = {};
    filteredBookings.forEach(booking => {
      if (!serviceBreakdown[booking.serviceName]) {
        serviceBreakdown[booking.serviceName] = {
          count: 0,
          revenue: 0,
          completed: 0,
          cancelled: 0
        };
      }
      serviceBreakdown[booking.serviceName].count++;
      if (booking.paymentStatus === 'paid') {
        serviceBreakdown[booking.serviceName].revenue += booking.amount;
      }
      if (booking.status === 'completed') {
        serviceBreakdown[booking.serviceName].completed++;
      }
      if (booking.status === 'cancelled') {
        serviceBreakdown[booking.serviceName].cancelled++;
      }
    });

    // Reviews summary
    const totalReviews = filteredReviews.length;
    const avgRating = totalReviews > 0
      ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    const ratingDistribution = {
      5: filteredReviews.filter(r => r.rating === 5).length,
      4: filteredReviews.filter(r => r.rating === 4).length,
      3: filteredReviews.filter(r => r.rating === 3).length,
      2: filteredReviews.filter(r => r.rating === 2).length,
      1: filteredReviews.filter(r => r.rating === 1).length,
    };

    return {
      bookings: filteredBookings,
      reviews: filteredReviews,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue,
      pendingRevenue,
      serviceBreakdown,
      totalReviews,
      avgRating,
      ratingDistribution
    };
  }, [reportType, dateRange, customStartDate, customEndDate]);

  // Export to CSV
  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'bookings') {
      filename = `bookings_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Booking ID,Customer Name,Service,Date,Time,Status,Amount,Payment Status\n';
      reportData.bookings.forEach(booking => {
        csvContent += `${booking.id},${booking.customerName},${booking.serviceName},${new Date(booking.scheduledDate).toLocaleDateString()},${booking.scheduledTime},${booking.status},${booking.amount},${booking.paymentStatus}\n`;
      });
    } else if (reportType === 'revenue') {
      filename = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Service Name,Total Bookings,Completed,Cancelled,Revenue\n';
      Object.entries(reportData.serviceBreakdown).forEach(([name, stats]) => {
        csvContent += `${name},${stats.count},${stats.completed},${stats.cancelled},${stats.revenue}\n`;
      });
      csvContent += `\nTotal Revenue,,,₹${reportData.totalRevenue}\n`;
    } else if (reportType === 'reviews') {
      filename = `reviews_report_${new Date().toISOString().split('T')[0]}.csv`;
      csvContent = 'Customer Name,Service,Rating,Comment,Date\n';
      reportData.reviews.forEach(review => {
        const comment = review.comment.replace(/,/g, ';').replace(/\n/g, ' ');
        csvContent += `${review.userId.name},${review.serviceId.serviceName},${review.rating},"${comment}",${new Date(review.createdAt).toLocaleDateString()}\n`;
      });
      csvContent += `\nAverage Rating,${reportData.avgRating.toFixed(2)}\n`;
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
    doc.text(`${MOCK_PROVIDER.providerName}`, 14, 15);
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
        b.id,
        b.customerName,
        b.serviceName,
        new Date(b.scheduledDate).toLocaleDateString(),
        b.status,
        `Rs. ${b.amount}`
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Booking ID', 'Customer', 'Service', 'Date', 'Status', 'Amount']],
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
    } else if (reportType === 'reviews') {
      // Summary
      doc.setFontSize(10);
      doc.text(`Total Reviews: ${reportData.totalReviews} | Average Rating: ${reportData.avgRating.toFixed(2)} Stars`, 14, yPos);
      yPos += 7;

      // Rating distribution
      doc.text('Rating Distribution:', 14, yPos);
      yPos += 5;
      [5, 4, 3, 2, 1].forEach(rating => {
        doc.text(`${rating} Star: ${reportData.ratingDistribution[rating]} reviews`, 20, yPos);
        yPos += 5;
      });
      yPos += 3;

      // Reviews table
      const tableData = reportData.reviews.map(r => [
        r.userId.name,
        r.serviceId.serviceName,
        `${r.rating} Stars`,
        r.comment.substring(0, 60) + (r.comment.length > 60 ? '...' : ''),
        new Date(r.createdAt).toLocaleDateString()
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Customer', 'Service', 'Rating', 'Comment', 'Date']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [66, 139, 202] },
        styles: { fontSize: 8 },
        columnStyles: {
          3: { cellWidth: 70 }
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
              <TableCell>Booking ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{booking.serviceName}</TableCell>
                <TableCell>{new Date(booking.scheduledDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={booking.status} 
                    size="small"
                    color={
                      booking.status === 'completed' ? 'success' :
                      booking.status === 'confirmed' ? 'info' :
                      booking.status === 'pending' ? 'warning' : 'error'
                    }
                  />
                </TableCell>
                <TableCell align="right">₹{booking.amount}</TableCell>
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

  const renderReviewsReport = () => (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">{reportData.totalReviews}</Typography>
              <Typography variant="body2" color="text.secondary">Total Reviews</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">{reportData.avgRating.toFixed(1)}</Typography>
              <Typography variant="body2" color="text.secondary">Average Rating</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{reportData.ratingDistribution[5]}</Typography>
              <Typography variant="body2" color="text.secondary">5 Star Reviews</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Rating Distribution</Typography>
        {[5, 4, 3, 2, 1].map(rating => (
          <Box key={rating} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>{rating} Star</Typography>
            <Box sx={{ flex: 1, bgcolor: 'grey.200', height: 24, borderRadius: 1, overflow: 'hidden' }}>
              <Box 
                sx={{ 
                  width: `${(reportData.ratingDistribution[rating] / reportData.totalReviews) * 100}%`,
                  bgcolor: 'warning.main',
                  height: '100%'
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
              {reportData.ratingDistribution[rating]}
            </Typography>
          </Box>
        ))}
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.reviews.map((review) => (
              <TableRow key={review.feedbackId}>
                <TableCell>{review.userId.name}</TableCell>
                <TableCell>{review.serviceId.serviceName}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={`${review.rating} ⭐`} 
                    size="small"
                    color={review.rating >= 4 ? 'success' : review.rating === 3 ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{review.comment}</TableCell>
                <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
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
              <MenuItem value="reviews">Reviews Report</MenuItem>
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
      {reportType === 'bookings' && renderBookingsReport()}
      {reportType === 'revenue' && renderRevenueReport()}
      {reportType === 'reviews' && renderReviewsReport()}
    </Paper>
  );
};

export default Reports;
