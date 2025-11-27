import './HowItWorks.css';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BuildIcon from '@mui/icons-material/Build';
import PaymentIcon from '@mui/icons-material/Payment';
import { Box, Paper, Typography } from '@mui/material';

const steps = [
    {
        title: 'Contact Service Provider',
        desc: 'Message or call the provider directly to discuss details, availability, and special requests before booking.',
        icon: <ContactPhoneIcon />
    },
    {
        title: 'Book a Service',
        desc: 'Search, compare and schedule in seconds — pick time and professional that fits your needs.',
        icon: <EventAvailableIcon />
    },
    {
        title:
            'Receive Service',
        desc: 'Enjoy high-quality service delivered at your doorstep; manage appointments and communicate easily.',
        icon: <BuildIcon />
    },
    {
        title: 'Pay Securely',
        desc: 'Pay with saved cards, Apple Pay, or in-app wallets — secure, flexible and simple.',
        icon: <PaymentIcon />
    }
];

const HowItWorks = () => {
    return (
        <Box component="section"
            className="hiw-section"
            aria-label="How it works"
            style={{ padding: '2rem 1rem' }}>
            <Box className="container hiw-container">
                <Typography
                    variant="h5"
                    component="h2"
                    className="hiw-title"
                    gutterBottom>
                    How It Works
                </Typography>
                <Typography
                    variant="body1"
                    className="hiw-description"
                    gutterBottom>
                    Finding and booking local services has never been easier. Follow these simple steps to get started
                </Typography>
                <Box className="hiw-grid">
                    {steps.map((step, id) => (
                        <Paper key={id}
                            className="hiw-step"
                            elevation={0}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                alignItems: 'center',
                                p: 3,
                                width: '100%',
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                color: 'text.primary',
                                boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"
                            }}
                        >
                            <Box className="hiw-icon"
                                aria-hidden
                                sx={{
                                    width: 72,
                                    height: 72,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'secondary.main',
                                    borderRadius: 2
                                }}
                            >
                                {step.icon}
                            </Box>
                            <Box className="hiw-text" sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="subtitle1"
                                    className="hiw-step-title"
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="hiw-step-desc"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {step.desc}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default HowItWorks;
