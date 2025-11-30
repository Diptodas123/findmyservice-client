import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/useThemeMode';
import toastMessage from '../../utils/toastMessage';

const Contact = () => {
  const { mode } = useThemeMode();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toastMessage({ msg: 'Please fill in all fields', type: 'error' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastMessage({ msg: 'Please enter a valid email address', type: 'error' });
      return;
    }

    // Construct mailto link
    const mailtoLink = `mailto:support@findmyservice.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    // Open default email client
    window.location.href = mailtoLink;
    
    // Show success message
    toastMessage({ msg: 'Opening your email client...', type: 'success' });
    
    // Reset form after a short delay
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Email',
      content: 'support@findmyservice.com',
      link: 'mailto:support@findmyservice.com'
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: mode === 'dark' ? '#90caf9' : '#1976d2' }} />,
      title: 'Address',
      content: '123 Service Street, Business District, City, Country',
      link: null
    }
  ];

  return (
    <Box sx={{ 
      py: 8, 
      minHeight: '80vh',
      background: mode === 'dark' 
        ? 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)' 
        : 'linear-gradient(180deg, #f5f5f5 0%, #e8f4f8 100%)'
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: mode === 'dark' 
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 60%, #42a5f5 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #2196f3 60%, #64b5f6 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: mode === 'dark' 
                ? '0 4px 8px rgba(144, 202, 249, 0.3)'
                : '0 4px 8px rgba(25, 118, 210, 0.2)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                background: mode === 'dark' 
                  ? 'linear-gradient(90deg, #90caf9, #64b5f6)'
                  : 'linear-gradient(90deg, #1976d2, #2196f3)',
                borderRadius: 2
              }
            }}
          >
            Contact Us
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              maxWidth: 600, 
              mx: 'auto', 
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              lineHeight: 1.6
            }}
          >
            Have questions? We'd love to hear from you.
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 500, 
              mx: 'auto', 
              fontWeight: 300,
              fontSize: '1rem',
              opacity: 0.8
            }}
          >
            Send us a message and we'll respond as soon as possible.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Grid container spacing={4} sx={{ maxWidth: 1200, width: '100%' }}>
            {/* Left side - Contact Information and Business Hours */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Contact Information Cards */}
              {contactInfo.map((info, index) => (
                <Paper
                  key={index}
                  elevation={mode === 'dark' ? 0 : 2}
                  sx={{
                    p: 3,
                    background: mode === 'dark' ? '#1e1e1e' : '#fff',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    transition: 'all 0.3s ease',
                    border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: mode === 'dark' ? '0 8px 16px rgba(144, 202, 249, 0.2)' : '0 8px 16px rgba(25, 118, 210, 0.15)',
                      borderColor: mode === 'dark' ? 'rgba(144, 202, 249, 0.3)' : 'rgba(25, 118, 210, 0.2)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 2,
                      borderRadius: '50%',
                      background: mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {info.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 0.5 }}>
                      {info.title}
                    </Typography>
                    {info.link ? (
                      <Typography
                        component="a"
                        href={info.link}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          textDecoration: 'none',
                          wordBreak: 'break-word',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {info.content}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {info.content}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              ))}

              {/* Business Hours */}
              <Paper
                elevation={mode === 'dark' ? 0 : 2}
                sx={{
                  p: 4,
                  background: mode === 'dark' ? '#1e1e1e' : '#fff',
                  borderRadius: 3,
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: mode === 'dark' ? '0 8px 16px rgba(144, 202, 249, 0.2)' : '0 8px 16px rgba(25, 118, 210, 0.15)',
                  }
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Business Hours
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={500}>Monday - Friday</Typography>
                    <Typography variant="body2" color="text.secondary">9:00 AM - 6:00 PM</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={500}>Saturday</Typography>
                    <Typography variant="body2" color="text.secondary">10:00 AM - 4:00 PM</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={500}>Sunday</Typography>
                    <Typography variant="body2" color="text.secondary">Closed</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>

          {/* Right side - Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={mode === 'dark' ? 0 : 3}
              sx={{
                p: 5,
                background: mode === 'dark' ? '#1e1e1e' : '#fff',
                borderRadius: 3,
                border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
                height: 'fit-content'
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                Send us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the form below and we'll get back to you as soon as possible
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for contacting us! We'll get back to you soon.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={6}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<SendIcon />}
                    sx={{
                      py: 1.8,
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      background: mode === 'dark' 
                        ? 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                        : 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      boxShadow: '0 3px 10px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: mode === 'dark'
                          ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                          : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        boxShadow: '0 5px 15px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;